import { DownloadPolicyMode } from '@prisma/client';

import { db } from '@/lib/db';

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
