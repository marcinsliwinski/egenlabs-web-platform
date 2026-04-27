import { ContentStatus, NewsFeedCategory } from '@prisma/client';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { db } from '@/lib/db';

type DesktopNewsFilters = {
  productKey: string;
  editionKey: string;
  channelKey: string;
  currentVersion?: string;
  category?: NewsFeedCategory;
  limit?: number;
};

type DesktopUpdateFilters = {
  productKey: string;
  editionKey: string;
  channelKey: string;
  currentVersion: string;
};

type VersionToken = number | string;

function normalizeVersionToken(token: string): VersionToken {
  return /^\d+$/.test(token) ? Number(token) : token.toLowerCase();
}

export function compareVersions(left: string, right: string) {
  const leftParts = left.split(/[._-]/).filter(Boolean).map(normalizeVersionToken);
  const rightParts = right.split(/[._-]/).filter(Boolean).map(normalizeVersionToken);
  const maxLength = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const leftPart = leftParts[index] ?? 0;
    const rightPart = rightParts[index] ?? 0;

    if (typeof leftPart === 'number' && typeof rightPart === 'number') {
      if (leftPart > rightPart) {
        return 1;
      }

      if (leftPart < rightPart) {
        return -1;
      }

      continue;
    }

    const normalizedLeft = String(leftPart);
    const normalizedRight = String(rightPart);

    if (normalizedLeft > normalizedRight) {
      return 1;
    }

    if (normalizedLeft < normalizedRight) {
      return -1;
    }
  }

  return 0;
}

function matchesVersionRange(currentVersion: string | undefined, minVersion: string | null, maxVersion: string | null) {
  if (!currentVersion) {
    return true;
  }

  if (minVersion && compareVersions(currentVersion, minVersion) < 0) {
    return false;
  }

  if (maxVersion && compareVersions(currentVersion, maxVersion) > 0) {
    return false;
  }

  return true;
}

function clampNewsLimit(value: number | undefined) {
  if (!value || Number.isNaN(value)) {
    return 20;
  }

  return Math.max(1, Math.min(value, 50));
}

async function resolveDesktopCombination(productKey: string, editionKey: string, channelKey: string) {
  return db.product.findFirst({
    where: {
      key: productKey,
      editions: {
        some: {
          key: editionKey
        }
      }
    },
    include: {
      editions: {
        where: { key: editionKey },
        take: 1
      },
      builds: {
        where: {
          isActive: true,
          edition: { key: editionKey },
          channel: { key: channelKey }
        },
        include: {
          channel: true,
          edition: true,
          assets: {
            orderBy: { createdAt: 'asc' },
            take: 1
          }
        },
        orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
        take: 1
      },
      downloadPolicies: {
        where: {
          edition: { key: editionKey },
          channel: { key: channelKey }
        },
        include: {
          channel: true,
          edition: true
        },
        take: 1
      }
    }
  });
}

export async function getDesktopUpdateSnapshot(filters: DesktopUpdateFilters) {
  const combination = await resolveDesktopCombination(filters.productKey, filters.editionKey, filters.channelKey);
  const edition = combination?.editions[0] ?? null;
  const build = combination?.builds[0] ?? null;
  const policy = combination?.downloadPolicies[0] ?? null;

  if (!combination || !edition) {
    return {
      found: false as const,
      status: 'combination_not_found' as const,
      message: 'The requested desktop release combination does not exist.'
    };
  }

  if (!build) {
    return {
      found: true as const,
      status: 'active_build_missing' as const,
      product: combination,
      edition,
      channelKey: filters.channelKey,
      message: 'No active build is configured for the requested combination.'
    };
  }

  const updateAvailable = compareVersions(filters.currentVersion, build.version) < 0;
  const primaryAsset = build.assets[0] ?? null;

  return {
    found: true as const,
    status: 'ok' as const,
    product: {
      key: combination.key,
      name: combination.name,
      slug: combination.slug
    },
    edition: {
      key: edition.key,
      name: edition.name
    },
    channel: {
      key: build.channel.key,
      name: build.channel.name
    },
    currentVersion: filters.currentVersion,
    updateAvailable,
    latestBuild: {
      id: build.id,
      version: build.version,
      buildNumber: build.buildNumber,
      minSupportedVersion: build.minSupportedVersion,
      notes: build.notes,
      publishedAt: build.publishedAt,
      asset: primaryAsset
        ? {
            fileName: primaryAsset.fileName,
            fileSizeBytes: primaryAsset.fileSizeBytes,
            checksumSha256: primaryAsset.checksumSha256,
            mimeType: primaryAsset.mimeType
          }
        : null
    },
    download: {
      policyMode: policy?.mode ?? null,
      isEnabled: policy?.isEnabled ?? false,
      requiresEmailRegistration: policy?.requireEmailRegistration ?? true,
      registrationPath: `/download/register?product=${combination.key}&edition=${edition.key}&channel=${build.channel.key}`
    }
  };
}

export async function getDesktopNewsFeed(filters: DesktopNewsFilters) {
  const limit = clampNewsLimit(filters.limit);
  const [product, channel] = await Promise.all([
    db.product.findFirst({
      where: {
        key: filters.productKey,
        editions: {
          some: { key: filters.editionKey }
        }
      },
      include: {
        editions: {
          where: { key: filters.editionKey },
          take: 1
        }
      }
    }),
    db.releaseChannel.findUnique({ where: { key: filters.channelKey } })
  ]);

  const edition = product?.editions[0] ?? null;

  if (!product || !edition || !channel) {
    return {
      found: false as const,
      status: 'combination_not_found' as const,
      message: 'The requested desktop news combination does not exist.'
    };
  }

  const newsItems = await db.newsFeedItem.findMany({
    where: {
      productId: product.id,
      editionId: edition.id,
      channelId: channel.id,
      status: ContentStatus.PUBLISHED,
      publishedAt: {
        lte: new Date()
      },
      ...(filters.category ? { category: filters.category } : {})
    },
    orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: limit * 3
  });

  const filteredItems = newsItems
    .filter((item) => matchesVersionRange(filters.currentVersion, item.minVersion, item.maxVersion))
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      slug: item.slug,
      category: item.category,
      title: item.title,
      summary: item.summary,
      content: item.content,
      ctaLabel: item.ctaLabel,
      ctaUrl: item.ctaUrl,
      isPinned: item.isPinned,
      publishedAt: item.publishedAt,
      minVersion: item.minVersion,
      maxVersion: item.maxVersion
    }));

  return {
    found: true as const,
    status: 'ok' as const,
    product: {
      key: product.key,
      name: product.name,
      slug: product.slug
    },
    edition: {
      key: edition.key,
      name: edition.name
    },
    channel: {
      key: channel.key,
      name: channel.name
    },
    filters: {
      currentVersion: filters.currentVersion ?? null,
      category: filters.category ?? null,
      limit
    },
    items: filteredItems
  };
}

export async function getAdminDesktopOverview() {
  const admin = await requireAuthenticatedAdmin();
  const [products, releaseChannels, stats, newsItems] = await Promise.all([
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
    Promise.all([
      db.newsFeedItem.count(),
      db.newsFeedItem.count({ where: { status: ContentStatus.PUBLISHED } }),
      db.newsFeedItem.count({ where: { isPinned: true } })
    ]),
    db.newsFeedItem.findMany({
      include: {
        product: true,
        edition: true,
        channel: true
      },
      orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }, { createdAt: 'desc' }],
      take: 50
    })
  ]);

  return {
    admin,
    products,
    releaseChannels,
    stats: {
      newsItemCount: stats[0],
      publishedNewsItemCount: stats[1],
      pinnedNewsItemCount: stats[2]
    },
    newsItems
  };
}
