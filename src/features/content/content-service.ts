import { ContentStatus } from '@prisma/client';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { db } from '@/lib/db';


export async function getPublicSiteOverview() {
  const [faqEntries, blogPosts] = await Promise.all([
    db.faqEntry.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 5
    }),
    db.blogPost.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 3
    })
  ]);

  return {
    faqEntries,
    blogPosts,
    stats: {
      faqCount: faqEntries.length,
      blogPostCount: blogPosts.length
    }
  };
}

export async function getPublicFaqEntries() {
  return db.faqEntry.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }]
  });
}

export async function getPublicBlogPosts() {
  return db.blogPost.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }]
  });
}

export async function getPublicBlogPostBySlug(slug: string) {
  return db.blogPost.findFirst({
    where: {
      slug,
      status: ContentStatus.PUBLISHED
    }
  });
}

export async function getPublicProductLandingOverview(productSlug: string) {
  const [product, siteOverview] = await Promise.all([
    db.product.findUnique({
      where: { slug: productSlug },
      include: {
        editions: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' }
        },
        builds: {
          where: { isActive: true },
          include: {
            channel: true,
            edition: true,
            assets: true
          },
          orderBy: [{ updatedAt: 'desc' }]
        }
      }
    }),
    getPublicSiteOverview()
  ]);

  return {
    product,
    siteOverview
  };
}

export async function getAdminContentOverview() {
  const admin = await requireAuthenticatedAdmin();

  const [faqCount, publishedFaqCount, blogPostCount, publishedBlogPostCount, faqEntries, blogPosts] =
    await Promise.all([
      db.faqEntry.count(),
      db.faqEntry.count({ where: { status: ContentStatus.PUBLISHED } }),
      db.blogPost.count(),
      db.blogPost.count({ where: { status: ContentStatus.PUBLISHED } }),
      db.faqEntry.findMany({
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
        take: 50
      }),
      db.blogPost.findMany({
        orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
        take: 50
      })
    ]);

  return {
    admin,
    stats: {
      faqCount,
      publishedFaqCount,
      blogPostCount,
      publishedBlogPostCount
    },
    faqEntries,
    blogPosts
  };
}
