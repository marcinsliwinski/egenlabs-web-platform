import { createHash, randomBytes } from 'node:crypto';

export type DownloadLinkLookupInput = {
  token?: string | null;
  slug?: string | null;
};

export function normalizeBaseUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export function createDownloadToken() {
  return randomBytes(24).toString('hex');
}

export function createDownloadTokenHash(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function createPublicSlug() {
  return `dl_${randomBytes(12).toString('hex')}`;
}

export function normalizeDownloadLinkLookup(input: DownloadLinkLookupInput) {
  const token = input.token?.trim();
  const slug = input.slug?.trim();

  return {
    token: token && token.length > 0 ? token : undefined,
    slug: slug && slug.length > 0 ? slug : undefined
  };
}

export function buildDownloadAccessUrl(baseUrl: string, input: DownloadLinkLookupInput) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const lookup = normalizeDownloadLinkLookup(input);
  const searchParams = new URLSearchParams();

  if (lookup.token) {
    searchParams.set('token', lookup.token);
  }

  if (lookup.slug) {
    searchParams.set('slug', lookup.slug);
  }

  return `${normalizedBaseUrl}/download/access?${searchParams.toString()}`;
}

export function buildDownloadDeliveryUrl(baseUrl: string, input: DownloadLinkLookupInput) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const lookup = normalizeDownloadLinkLookup(input);
  const searchParams = new URLSearchParams();

  if (lookup.token) {
    searchParams.set('token', lookup.token);
  }

  if (lookup.slug) {
    searchParams.set('slug', lookup.slug);
  }

  return `${normalizedBaseUrl}/api/v1/downloads/deliver?${searchParams.toString()}`;
}
