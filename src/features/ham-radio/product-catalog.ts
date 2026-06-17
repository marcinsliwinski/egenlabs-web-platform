import { cmcGenChokes } from './cmc-gen-chokes';
import { genFedKits } from './gen-fed-kits';
import { genFedUnuns } from './gen-fed-ununs';
import type { HamRadioProduct, HamRadioPowerLine } from './product-types';

export const hamRadioProducts = [...genFedKits, ...genFedUnuns, ...cmcGenChokes];

export const powerLineOrder: HamRadioPowerLine[] = ['µQRP', 'QRP', 'STD', 'HD'];

export function getHamRadioProduct(slug: string) {
  return hamRadioProducts.find((product) => product.slug === slug) ?? null;
}

export function getGenFedKitsBySeries(series: '40-10' | '80-10') {
  return genFedKits.filter((product) => product.series === series);
}

export function getGenFedKit(series: '40-10' | '80-10', slug: string) {
  return getGenFedKitsBySeries(series).find((product) => product.slug === slug) ?? null;
}

export function getGenFedUnun(slug: string) {
  return genFedUnuns.find((product) => product.slug === slug) ?? null;
}

export function getCmcGenChoke(slug: string) {
  return cmcGenChokes.find((product) => product.slug === slug) ?? null;
}

export function getProductShortDescription(product: HamRadioProduct) {
  if (product.productType === 'kit') {
    const radiator = product.radiatorVariant === 'S' ? 'skróconym cewką' : 'półfalowym';
    return `Kompletny zestaw antenowy ${product.series} z promiennikiem ${radiator}, Un-Unem 1:49 i dopasowanym CMC-GEN 1:1 Choke.`;
  }

  if (product.productType === 'un-un') {
    return `Samodzielny transformator 1:49 Un-Un linii ${product.powerLine} do systemów antenowych HF.`;
  }

  return `Samodzielny dławik prądów wspólnych CMC-GEN 1:1 linii ${product.powerLine} do instalacji HF.`;
}

export function getProductCategoryHref(product: HamRadioProduct) {
  if (product.productType === 'kit') {
    return `/products/gen-fed/${product.series}`;
  }

  return product.productType === 'un-un' ? '/products/gen-fed/un-un' : '/products/cmc-gen';
}

export function getProductCategoryLabel(product: HamRadioProduct) {
  if (product.productType === 'kit') {
    return `GEN-FED ${product.series}`;
  }

  return product.productType === 'un-un' ? 'GEN-FED 1:49 Un-Un' : 'CMC-GEN 1:1 Choke';
}
