import { notFound } from 'next/navigation';

import { genFedUnuns, getGenFedUnun, getProductShortDescription } from '@/features/ham-radio';
import { HamRadioProductPage } from '@/features/ham-radio/ham-radio-product-page';

type ProductPageProps = { params: Promise<{ code: string }> };

export function generateStaticParams() {
  return genFedUnuns.map((product) => ({ code: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { code } = await params;
  const product = getGenFedUnun(code);
  return product
    ? { title: `${product.name} | eGen Labs`, description: getProductShortDescription(product) }
    : { title: 'GEN-FED 1:49 Un-Un | eGen Labs' };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { code } = await params;
  const product = getGenFedUnun(code);
  if (!product) notFound();
  return <HamRadioProductPage product={product} />;
}
