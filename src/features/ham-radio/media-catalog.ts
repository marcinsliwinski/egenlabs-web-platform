import type { ProductMedia } from './product-types';

export type HamRadioMediaKey = 'gen-fed' | 'gen-fed-40-10' | 'gen-fed-80-10' | 'gen-fed-un-un' | 'cmc-gen';

/**
 * Add approved series images here after placing optimized assets in public/images/solutions.
 * Product-level images are assigned through the optional `media` field on each catalog item.
 */
export const hamRadioSeriesMedia: Partial<Record<HamRadioMediaKey, ProductMedia>> = {};
