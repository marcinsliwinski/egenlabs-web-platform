import Link from 'next/link';

import type { HamRadioProduct } from './product-types';
import { getProductShortDescription } from './product-catalog';

type HamRadioProductCardProps = {
  product: HamRadioProduct;
  href: string;
};

export function HamRadioProductCard({ product, href }: HamRadioProductCardProps) {
  return (
    <article className="card product-card">
      <div className="product-card__badges">
        {product.radiatorVariant ? <span className="status-pill">{product.radiatorVariant}</span> : null}
        <span className="status-pill status-pill--neutral">{product.powerLine}</span>
      </div>
      <h3>{product.name}</h3>
      <p className="meta-text">SKU: {product.sku}</p>
      <p>{getProductShortDescription(product)}</p>
      <dl className="product-card__facts">
        {product.radiatorLength ? (
          <div>
            <dt>Promiennik</dt>
            <dd>{product.radiatorLength}</dd>
          </div>
        ) : null}
        <div>
          <dt>Moc</dt>
          <dd>{product.ratedPower}</dd>
        </div>
      </dl>
      <Link className="text-link" href={href}>Zobacz produkt</Link>
    </article>
  );
}
