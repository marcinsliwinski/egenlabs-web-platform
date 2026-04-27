import { db } from '@/lib/db';
import { resolveDownloadTarget } from '@/features/downloads/download-service';

export async function getCatalogOverview() {
  const [products, releaseChannels, buildCount, activeBuildCount, downloadPolicies, downloadRequestCount, downloadLinkCount] = await Promise.all([
    db.product.findMany({
      orderBy: { name: 'asc' },
      include: {
        editions: {
          orderBy: { name: 'asc' },
          include: {
            builds: {
              orderBy: [{ createdAt: 'desc' }],
              include: {
                channel: true,
                assets: true
              }
            }
          }
        }
      }
    }),
    db.releaseChannel.findMany({
      orderBy: { key: 'asc' }
    }),
    db.build.count(),
    db.build.count({
      where: { isActive: true }
    }),
    db.downloadPolicy.findMany(),
    db.downloadRequest.count(),
    db.downloadLink.count()
  ]);

  const policyMap = new Map(
    downloadPolicies.map((policy) => [
      `${policy.productId}:${policy.editionId}:${policy.channelId}`,
      policy
    ])
  );

  const combinations = products.flatMap((product) =>
    product.editions.flatMap((edition) =>
      releaseChannels.map((channel) => {
        const activeBuild = edition.builds.find(
          (build) => build.channelId === channel.id && build.isActive
        ) ?? null;
        const policy = policyMap.get(`${product.id}:${edition.id}:${channel.id}`) ?? null;

        return resolveDownloadTarget(policy, activeBuild);
      })
    )
  );

  const readyCombinationCount = combinations.filter((item) => item.status === 'ready').length;

  return {
    products,
    releaseChannels,
    stats: {
      productCount: products.length,
      releaseChannelCount: releaseChannels.length,
      buildCount,
      activeBuildCount
    },
    downloadStats: {
      policyCount: downloadPolicies.length,
      readyCombinationCount,
      downloadRequestCount,
      downloadLinkCount
    }
  };
}
