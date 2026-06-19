import { access, readFile } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';

import { DownloadLinkStatus, DownloadPolicyMode } from '@prisma/client';

import { db } from '@/lib/db';
import { resolveExistingStorageFile, resolveStoragePath } from '@/lib/storage-path';
import { emailEnv } from '@/features/email/email-env';
import {
  buildDownloadDeliveryUrl,
  createDownloadTokenHash,
  normalizeDownloadLinkLookup,
  type DownloadLinkLookupInput
} from '@/features/downloads/download-link';

export const DOWNLOAD_POLICY_MODE_OPTIONS = [
  {
    value: DownloadPolicyMode.PUBLIC_DIRECT,
    label: 'Public direct',
    description: 'Public link target intended for direct delivery once public flow is enabled.'
  },
  {
    value: DownloadPolicyMode.ONE_TIME,
    label: 'One-time',
    description: 'A single-use link that will later be generated per download request.'
  },
  {
    value: DownloadPolicyMode.TEMPORARY,
    label: 'Temporary',
    description: 'A time-limited link that will later use the configured TTL window.'
  },
  {
    value: DownloadPolicyMode.PRIVATE_STATIC,
    label: 'Private static',
    description: 'A private reusable link intended for controlled delivery.'
  }
] as const;

export type DownloadResolutionStatus =
  | 'ready'
  | 'policy_missing'
  | 'policy_disabled'
  | 'active_build_missing';

const DOWNLOAD_LINK_INCLUDE = {
  policy: true,
  request: {
    include: {
      product: true,
      edition: true,
      channel: true,
      lead: true
    }
  },
  build: {
    include: {
      assets: true,
      product: true,
      edition: true,
      channel: true
    }
  }
} as const;

type DownloadLinkRecord = Awaited<ReturnType<typeof findIssuedDownloadLink>>;

type LinkInspectionFailureStatus = 'missing' | 'not_found' | 'revoked' | 'expired' | 'consumed';

type LinkInspectionFailure = {
  status: LinkInspectionFailureStatus;
  summary: string;
  link?: NonNullable<DownloadLinkRecord>;
};

type LinkInspectionSuccess = {
  status: 'ready';
  summary: string;
  deliveryUrl: string;
  link: NonNullable<DownloadLinkRecord>;
};

type DeliveryFailureStatus = LinkInspectionFailureStatus;

type DeliveryFailure = {
  success: false;
  status: DeliveryFailureStatus;
  summary: string;
  httpStatus: number;
};

type DeliverySuccess = {
  success: true;
  summary: string;
  fileName: string;
  contentType: string;
  body: Uint8Array;
  link: NonNullable<DownloadLinkRecord>;
};

export async function getDownloadPolicyOverview() {
  const [products, releaseChannels, policies, activeBuilds, requestCount, linkCount] = await Promise.all([
    db.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        editions: {
          where: { isActive: true },
          orderBy: { name: 'asc' }
        }
      }
    }),
    db.releaseChannel.findMany({
      where: { isActive: true },
      orderBy: { key: 'asc' }
    }),
    db.downloadPolicy.findMany({
      orderBy: [{ createdAt: 'desc' }]
    }),
    db.build.findMany({
      where: { isActive: true },
      include: {
        assets: {
          orderBy: { createdAt: 'asc' }
        }
      }
    }),
    db.downloadRequest.count(),
    db.downloadLink.count()
  ]);

  const policyMap = new Map(
    policies.map((policy) => [
      `${policy.productId}:${policy.editionId}:${policy.channelId}`,
      policy
    ])
  );

  const activeBuildMap = new Map(
    activeBuilds.map((build) => [`${build.productId}:${build.editionId}:${build.channelId}`, build])
  );

  const combinations = products.flatMap((product) =>
    product.editions.flatMap((edition) =>
      releaseChannels.map((channel) => {
        const key = `${product.id}:${edition.id}:${channel.id}`;
        const policy = policyMap.get(key) ?? null;
        const activeBuild = activeBuildMap.get(key) ?? null;
        const resolution = resolveDownloadTarget(policy, activeBuild);

        return {
          id: key,
          product,
          edition,
          channel,
          policy,
          activeBuild,
          resolution
        };
      })
    )
  );

  const readyCombinationCount = combinations.filter((item) => item.resolution.status === 'ready').length;
  const configuredPolicyCount = combinations.filter((item) => item.policy !== null).length;

  return {
    products,
    releaseChannels,
    combinations,
    stats: {
      policyCount: policies.length,
      configuredPolicyCount,
      readyCombinationCount,
      downloadRequestCount: requestCount,
      downloadLinkCount: linkCount
    }
  };
}

export function resolveDownloadTarget(
  policy:
    | {
        mode: DownloadPolicyMode;
        isEnabled: boolean;
        linkTtlMinutes: number | null;
        requireActiveBuild: boolean;
        requireEmailRegistration: boolean;
      }
    | null,
  activeBuild:
    | {
        id: string;
        version: string;
        buildNumber: number;
        publishedAt: Date | null;
        assets: Array<{ id: string; fileName: string; storagePath: string }>;
      }
    | null
) {
  if (!policy) {
    return {
      status: 'policy_missing' as const,
      summary: 'No download policy configured.'
    };
  }

  if (!policy.isEnabled) {
    return {
      status: 'policy_disabled' as const,
      summary: 'Download policy exists but is disabled.'
    };
  }

  if (policy.requireActiveBuild && !activeBuild) {
    return {
      status: 'active_build_missing' as const,
      summary: 'Policy is configured, but there is no active build for this release channel.'
    };
  }

  const modeSummary = getPolicyModeLabel(policy.mode);
  const ttlSummary =
    policy.mode === DownloadPolicyMode.TEMPORARY
      ? ` TTL: ${policy.linkTtlMinutes ?? 'not set'} minutes.`
      : '';
  const registrationSummary = policy.requireEmailRegistration
    ? ' Email registration will be required by the future public flow.'
    : ' Email registration will not be required once the public flow exists.';

  return {
    status: 'ready' as const,
    summary: `${modeSummary} policy is configured.${ttlSummary}${registrationSummary}`,
    buildSummary: activeBuild
      ? `Active build: ${activeBuild.version} (#${activeBuild.buildNumber})`
      : 'No active build linked.'
  };
}

export function getPolicyModeLabel(mode: DownloadPolicyMode) {
  const option = DOWNLOAD_POLICY_MODE_OPTIONS.find((item) => item.value === mode);

  return option?.label ?? mode;
}

function getDownloadLookupWhereClause(input: DownloadLinkLookupInput) {
  const lookup = normalizeDownloadLinkLookup(input);

  if (lookup.token) {
    return {
      tokenHash: createDownloadTokenHash(lookup.token)
    };
  }

  if (lookup.slug) {
    return {
      publicSlug: lookup.slug
    };
  }

  return null;
}

async function findIssuedDownloadLink(input: DownloadLinkLookupInput) {
  const where = getDownloadLookupWhereClause(input);

  if (!where) {
    return null;
  }

  return db.downloadLink.findFirst({
    where,
    include: DOWNLOAD_LINK_INCLUDE
  });
}

function buildLinkInspectionFailure(status: LinkInspectionFailureStatus): LinkInspectionFailure {
  switch (status) {
    case 'missing':
      return {
        status,
        summary: 'Provide a token or slug to inspect an issued download link.'
      };
    case 'not_found':
      return {
        status,
        summary: 'The requested issued download link does not exist.'
      };
    case 'revoked':
      return {
        status,
        summary: 'This issued download link has been revoked.'
      };
    case 'expired':
      return {
        status,
        summary: 'This issued download link has expired.'
      };
    case 'consumed':
      return {
        status,
        summary: 'This one-time download link has already been consumed.'
      };
  }
}

async function markLinkExpired(linkId: string) {
  return db.downloadLink.update({
    where: { id: linkId },
    data: {
      status: DownloadLinkStatus.EXPIRED
    },
    include: DOWNLOAD_LINK_INCLUDE
  });
}

function buildReadySummary(link: NonNullable<DownloadLinkRecord>) {
  const modeLabel = getPolicyModeLabel(link.mode);

  if (link.mode === DownloadPolicyMode.ONE_TIME) {
    return `${modeLabel} issued download link is valid. The link will be consumed when the delivery endpoint is used.`;
  }

  if (link.mode === DownloadPolicyMode.TEMPORARY) {
    return `${modeLabel} issued download link is valid and will stay available until its TTL expires.`;
  }

  return `${modeLabel} issued download link is valid and ready for the delivery shell.`;
}

export async function inspectIssuedDownloadLinkAccess(input: DownloadLinkLookupInput): Promise<LinkInspectionFailure | LinkInspectionSuccess> {
  const lookup = normalizeDownloadLinkLookup(input);

  if (!lookup.token && !lookup.slug) {
    return buildLinkInspectionFailure('missing');
  }

  const downloadLink = await findIssuedDownloadLink(lookup);

  if (!downloadLink) {
    return buildLinkInspectionFailure('not_found');
  }

  if (downloadLink.status === DownloadLinkStatus.REVOKED) {
    return buildLinkInspectionFailure('revoked');
  }

  if (downloadLink.expiresAt && downloadLink.expiresAt <= new Date()) {
    const expiredLink =
      downloadLink.status === DownloadLinkStatus.ACTIVE
        ? await markLinkExpired(downloadLink.id)
        : downloadLink;

    return {
      ...buildLinkInspectionFailure('expired'),
      link: expiredLink
    };
  }

  if (downloadLink.status === DownloadLinkStatus.CONSUMED) {
    return {
      ...buildLinkInspectionFailure('consumed'),
      link: downloadLink
    };
  }

  return {
    status: 'ready',
    summary: buildReadySummary(downloadLink),
    deliveryUrl: buildDownloadDeliveryUrl(emailEnv.APP_URL, lookup),
    link: downloadLink
  };
}

async function resolveLocalAssetBuffer(storagePath: string) {
  const configuredPath = resolveStoragePath(storagePath);

  if (!configuredPath) {
    return {
      exists: false as const,
      buffer: null,
      absolutePath: null,
      reason: 'invalid_storage_path' as const
    };
  }

  const absolutePath = await resolveExistingStorageFile(storagePath);

  if (!absolutePath) {
    return {
      exists: false as const,
      buffer: null,
      absolutePath: configuredPath,
      reason: 'file_missing_or_outside_storage' as const
    };
  }

  try {
    await access(absolutePath, fsConstants.R_OK);
    const buffer = await readFile(absolutePath);

    return {
      exists: true as const,
      buffer,
      absolutePath,
      reason: null
    };
  } catch {
    return {
      exists: false as const,
      buffer: null,
      absolutePath,
      reason: 'file_not_readable' as const
    };
  }
}

function sanitizeAttachmentFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]+/g, '-');
}

function buildManifestFileName(link: NonNullable<DownloadLinkRecord>) {
  const baseName = `${link.build.product.slug}-${link.build.edition.key}-${link.build.channel.key}-delivery-shell.txt`;

  return sanitizeAttachmentFileName(baseName);
}

function buildDeliveryManifest(link: NonNullable<DownloadLinkRecord>) {
  const primaryAsset = link.build.assets[0] ?? null;

  return [
    'eGen Labs Web Platform - Download Delivery Shell',
    '',
    `Product: ${link.build.product.name}`,
    `Edition: ${link.build.edition.name}`,
    `Channel: ${link.build.channel.name}`,
    `Build: ${link.build.version} (#${link.build.buildNumber})`,
    `Link mode: ${link.mode}`,
    `Link status: ${link.status}`,
    `Expires at: ${link.expiresAt?.toISOString() ?? 'n/a'}`,
    `Consumed at: ${link.consumedAt?.toISOString() ?? 'n/a'}`,
    `Request email: ${link.request?.email ?? 'n/a'}`,
    '',
    primaryAsset
      ? `Primary asset: ${primaryAsset.fileName}${primaryAsset.fileSizeBytes ? ` (${primaryAsset.fileSizeBytes} bytes)` : ''}`
      : 'Primary asset: none attached',
    primaryAsset?.mimeType ? `MIME type: ${primaryAsset.mimeType}` : 'MIME type: n/a',
    primaryAsset?.checksumSha256 ? `SHA-256: ${primaryAsset.checksumSha256}` : 'SHA-256: n/a',
    '',
    'Final binary storage integration is not enabled yet in this step.',
    'This attachment confirms that the delivery endpoint resolved the issued link and the selected build asset metadata.'
  ].join('\n');
}

function buildDeliveryFailure(status: DeliveryFailureStatus): DeliveryFailure {
  switch (status) {
    case 'missing':
      return {
        success: false,
        status,
        summary: 'Provide a token or slug before using the delivery endpoint.',
        httpStatus: 400
      };
    case 'not_found':
      return {
        success: false,
        status,
        summary: 'The requested issued download link does not exist.',
        httpStatus: 404
      };
    case 'revoked':
      return {
        success: false,
        status,
        summary: 'This issued download link has been revoked.',
        httpStatus: 410
      };
    case 'expired':
      return {
        success: false,
        status,
        summary: 'This issued download link has expired.',
        httpStatus: 410
      };
    case 'consumed':
      return {
        success: false,
        status,
        summary: 'This one-time issued download link has already been consumed.',
        httpStatus: 410
      };
  }
}

export async function deliverIssuedDownloadLinkShell(input: DownloadLinkLookupInput): Promise<DeliveryFailure | DeliverySuccess> {
  const lookup = normalizeDownloadLinkLookup(input);

  if (!lookup.token && !lookup.slug) {
    return buildDeliveryFailure('missing');
  }

  const downloadLink = await findIssuedDownloadLink(lookup);

  if (!downloadLink) {
    return buildDeliveryFailure('not_found');
  }

  if (downloadLink.status === DownloadLinkStatus.REVOKED) {
    return buildDeliveryFailure('revoked');
  }

  if (downloadLink.expiresAt && downloadLink.expiresAt <= new Date()) {
    if (downloadLink.status === DownloadLinkStatus.ACTIVE) {
      await markLinkExpired(downloadLink.id);
    }

    return buildDeliveryFailure('expired');
  }

  if (downloadLink.status === DownloadLinkStatus.CONSUMED) {
    return buildDeliveryFailure('consumed');
  }

  const resolvedLink =
    downloadLink.mode === DownloadPolicyMode.ONE_TIME && downloadLink.status === DownloadLinkStatus.ACTIVE
      ? await db.downloadLink.update({
          where: { id: downloadLink.id },
          data: {
            status: DownloadLinkStatus.CONSUMED,
            consumedAt: new Date()
          },
          include: DOWNLOAD_LINK_INCLUDE
        })
      : downloadLink;

  const primaryAsset = resolvedLink.build.assets[0] ?? null;

  if (primaryAsset) {
    const localAsset = await resolveLocalAssetBuffer(primaryAsset.storagePath);

    if (localAsset.exists && localAsset.buffer) {
      return {
        success: true,
        summary: 'Local build asset delivery shell resolved and returned the stored file response.',
        fileName: sanitizeAttachmentFileName(primaryAsset.fileName),
        contentType: primaryAsset.mimeType ?? 'application/octet-stream',
        body: new Uint8Array(localAsset.buffer),
        link: resolvedLink
      };
    }
  }

  return {
    success: true,
    summary: 'Delivery shell resolved successfully and returned a manifest attachment because no local asset file was available.',
    fileName: buildManifestFileName(resolvedLink),
    contentType: 'text/plain; charset=utf-8',
    body: new TextEncoder().encode(buildDeliveryManifest(resolvedLink)),
    link: resolvedLink
  };
}
