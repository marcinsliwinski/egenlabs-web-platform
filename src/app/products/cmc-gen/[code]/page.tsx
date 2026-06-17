import { notFound } from 'next/navigation';

import { cmcGenChokes, getCmcGenChoke, getProductShortDescription } from '@/features/ham-radio';
import { HamRadioProductPage } from '@/features/ham-radio/ham-radio-product-page';

type ProductPageProps = { params: Promise<{ code: string }> };

export function generateStaticParams() {
  return cmcGenChokes.map((product) => ({ code: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { code } = await params;
  const product = getCmcGenChoke(code);
  return product
    ? { title: `${product.name} | eGen Labs`, description: getProductShortDescription(product) }
    : { title: 'CMC-GEN 1:1 Choke | eGen Labs' };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { code } = await params;
  const product = getCmcGenChoke(code);
  if (!product) notFound();
  return <HamRadioProductPage product={product} />;
}
