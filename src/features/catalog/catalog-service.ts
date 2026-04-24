import { db } from '@/lib/db';

export async function getCatalogOverview() {
  const [products, releaseChannels, buildCount, activeBuildCount] = await Promise.all([
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
    })
  ]);

  return {
    products,
    releaseChannels,
    stats: {
      productCount: products.length,
      releaseChannelCount: releaseChannels.length,
      buildCount,
      activeBuildCount
    }
  };
}
