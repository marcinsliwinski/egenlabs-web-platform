'use server';

import { ContentStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { logAdminAuditEvent } from '@/features/audit/audit-service';
import { db } from '@/lib/db';

const CONTENT_PATH = '/admin/content';
const PRODUCT_LANDING_PATH = '/products/fito-gen';

const contentStatusSchema = z.nativeEnum(ContentStatus);

const faqSchema = z.object({
  id: z.string().min(1).optional(),
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/, 'slug must use lowercase letters, numbers, and hyphens'),
  question: z.string().trim().min(5).max(200),
  answer: z.string().trim().min(10),
  sortOrder: z.coerce.number().int().min(0).max(10000),
  status: contentStatusSchema
});

const blogPostSchema = z.object({
  id: z.string().min(1).optional(),
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/, 'slug must use lowercase letters, numbers, and hyphens'),
  title: z.string().trim().min(5).max(180),
  excerpt: z.string().trim().min(10).max(320),
  content: z.string().trim().min(20),
  status: contentStatusSchema
});

function getRedirectWithStatus(status: string, kind: 'success' | 'error'): never {
  redirect(`${CONTENT_PATH}?${kind}=${status}`);
}

async function requireContentWriteAccess() {
  return requireAuthenticatedAdmin();
}

function getPublishedAt(status: ContentStatus, currentValue: Date | null | undefined) {
  if (status === ContentStatus.PUBLISHED) {
    return currentValue ?? new Date();
  }

  return null;
}

function revalidateContentPaths(slug?: string) {
  revalidatePath(CONTENT_PATH);
  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath('/faq');
  revalidatePath('/blog');
  revalidatePath(PRODUCT_LANDING_PATH);

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}

export async function createFaqEntryAction(formData: FormData) {
  const admin = await requireContentWriteAccess();

  const parsed = faqSchema.safeParse({
    slug: formData.get('slug'),
    question: formData.get('question'),
    answer: formData.get('answer'),
    sortOrder: formData.get('sortOrder'),
    status: formData.get('status')
  });

  if (!parsed.success) {
    getRedirectWithStatus('invalid_faq_input', 'error');
  }

  const input = parsed.data;
  const existing = await db.faqEntry.findUnique({ where: { slug: input.slug } });

  if (existing) {
    getRedirectWithStatus('faq_slug_exists', 'error');
  }

  const faqEntry = await db.faqEntry.create({
    data: {
      slug: input.slug,
      question: input.question,
      answer: input.answer,
      sortOrder: input.sortOrder,
      status: input.status,
      publishedAt: getPublishedAt(input.status, null)
    }
  });

  await logAdminAuditEvent({
    admin,
    actionType: 'FAQ_CREATED',
    entityType: 'FaqEntry',
    entityId: faqEntry.id,
    summary: `Created FAQ entry ${faqEntry.slug}.`,
    metadata: { status: faqEntry.status }
  });

  revalidateContentPaths();
  getRedirectWithStatus('faq_created', 'success');
}

export async function updateFaqEntryAction(formData: FormData) {
  const admin = await requireContentWriteAccess();

  const parsed = faqSchema.extend({
    id: z.string().min(1)
  }).safeParse({
    id: formData.get('id'),
    slug: formData.get('slug'),
    question: formData.get('question'),
    answer: formData.get('answer'),
    sortOrder: formData.get('sortOrder'),
    status: formData.get('status')
  });

  if (!parsed.success) {
    getRedirectWithStatus('invalid_faq_input', 'error');
  }

  const input = parsed.data;
  const existing = await db.faqEntry.findUnique({ where: { id: input.id } });

  if (!existing) {
    getRedirectWithStatus('faq_not_found', 'error');
  }

  const slugConflict = await db.faqEntry.findUnique({ where: { slug: input.slug } });

  if (slugConflict && slugConflict.id !== input.id) {
    getRedirectWithStatus('faq_slug_exists', 'error');
  }

  const updatedFaqEntry = await db.faqEntry.update({
    where: { id: input.id },
    data: {
      slug: input.slug,
      question: input.question,
      answer: input.answer,
      sortOrder: input.sortOrder,
      status: input.status,
      publishedAt: getPublishedAt(input.status, existing.publishedAt)
    }
  });

  await logAdminAuditEvent({
    admin,
    actionType: 'FAQ_UPDATED',
    entityType: 'FaqEntry',
    entityId: updatedFaqEntry.id,
    summary: `Updated FAQ entry ${updatedFaqEntry.slug}.`,
    metadata: { previousSlug: existing.slug, status: updatedFaqEntry.status }
  });

  revalidateContentPaths();
  getRedirectWithStatus('faq_updated', 'success');
}

export async function createBlogPostAction(formData: FormData) {
  const admin = await requireContentWriteAccess();

  const parsed = blogPostSchema.safeParse({
    slug: formData.get('slug'),
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    status: formData.get('status')
  });

  if (!parsed.success) {
    getRedirectWithStatus('invalid_blog_input', 'error');
  }

  const input = parsed.data;
  const existing = await db.blogPost.findUnique({ where: { slug: input.slug } });

  if (existing) {
    getRedirectWithStatus('blog_slug_exists', 'error');
  }

  const blogPost = await db.blogPost.create({
    data: {
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      status: input.status,
      publishedAt: getPublishedAt(input.status, null)
    }
  });

  await logAdminAuditEvent({
    admin,
    actionType: 'BLOG_CREATED',
    entityType: 'BlogPost',
    entityId: blogPost.id,
    summary: `Created blog post ${blogPost.slug}.`,
    metadata: { status: blogPost.status }
  });

  revalidateContentPaths(input.slug);
  getRedirectWithStatus('blog_created', 'success');
}

export async function updateBlogPostAction(formData: FormData) {
  const admin = await requireContentWriteAccess();

  const parsed = blogPostSchema.extend({
    id: z.string().min(1)
  }).safeParse({
    id: formData.get('id'),
    slug: formData.get('slug'),
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    status: formData.get('status')
  });

  if (!parsed.success) {
    getRedirectWithStatus('invalid_blog_input', 'error');
  }

  const input = parsed.data;
  const existing = await db.blogPost.findUnique({ where: { id: input.id } });

  if (!existing) {
    getRedirectWithStatus('blog_not_found', 'error');
  }

  const slugConflict = await db.blogPost.findUnique({ where: { slug: input.slug } });

  if (slugConflict && slugConflict.id !== input.id) {
    getRedirectWithStatus('blog_slug_exists', 'error');
  }

  const updatedBlogPost = await db.blogPost.update({
    where: { id: input.id },
    data: {
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      status: input.status,
      publishedAt: getPublishedAt(input.status, existing.publishedAt)
    }
  });

  await logAdminAuditEvent({
    admin,
    actionType: 'BLOG_UPDATED',
    entityType: 'BlogPost',
    entityId: updatedBlogPost.id,
    summary: `Updated blog post ${updatedBlogPost.slug}.`,
    metadata: { previousSlug: existing.slug, status: updatedBlogPost.status }
  });

  revalidateContentPaths(existing.slug);
  if (existing.slug !== input.slug) {
    revalidateContentPaths(input.slug);
  }
  getRedirectWithStatus('blog_updated', 'success');
}
