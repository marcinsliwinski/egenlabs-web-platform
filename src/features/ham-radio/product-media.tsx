import Image from 'next/image';

import type { ProductMedia } from './product-types';

type ProductMediaFrameProps = {
  label: string;
  media?: ProductMedia;
  compact?: boolean;
};

export function ProductMediaFrame({ label, media, compact = false }: ProductMediaFrameProps) {
  const cover = media?.cover;

  return (
    <figure className={compact ? 'product-media product-media--compact' : 'product-media'}>
      {cover ? (
        <Image
          alt={cover.alt}
          className="product-media__image"
          height={cover.height}
          priority={!compact}
          sizes={compact ? '(max-width: 700px) 100vw, 360px' : '(max-width: 900px) 100vw, 50vw'}
          src={cover.src}
          width={cover.width}
        />
      ) : (
        <div className="product-media__placeholder" aria-label={`Miejsce na zdjęcie: ${label}`}>
          <span aria-hidden="true">eG</span>
          <strong>{label}</strong>
          <small>Zdjęcie produktu zostanie dodane</small>
        </div>
      )}
    </figure>
  );
}
