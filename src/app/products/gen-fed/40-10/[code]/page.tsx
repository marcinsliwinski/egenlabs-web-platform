import { notFound } from 'next/navigation';

import { genFedKits, getGenFedKit, getProductShortDescription } from '@/features/ham-radio';
import { HamRadioProductPage } from '@/features/ham-radio/ham-radio-product-page';

type ProductPageProps = {
  params: Promise<{ code: string }>;
};

export function generateStaticParams() {
  return genFedKits.filter((product) => product.series === '40-10').map((product) => ({ code: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { code } = await params;
  const product = getGenFedKit('40-10', code);
  return product
    ? { title: `${product.name} | eGen Labs`, description: getProductShortDescription(product) }
    : { title: 'GEN-FED 40-10 | eGen Labs' };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { code } = await params;
  const product = getGenFedKit('40-10', code);
  if (!product) notFound();
  return <HamRadioProductPage product={product} />;
}
