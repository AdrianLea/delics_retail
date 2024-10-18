import clsx from 'clsx';
import {
  flattenConnection,
  Image,
  Money,
  useMoney,
  Video,
} from '@shopify/hydrogen';

import {Link} from '~/components';
import {isDiscounted} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';

export function ProductCard({
  product,
  label,
  className,
  loading,
  onClick,
  quickAdd,
}) {
  let cardLabel;

  const cardProduct = product?.variants ? product : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;

  const firstVariant = flattenConnection(cardProduct.variants)[0];
  const mediaRef = product?.metafields[0];
  let backVideo = null;
  let backImage = null;
  if (mediaRef && mediaRef.reference.sources) {
    backVideo = mediaRef.reference;
  } else if (mediaRef && mediaRef.reference.image) {
    backImage = mediaRef.reference.image;
  }

  if (!firstVariant) return null;
  const {image, price, compareAtPrice} = firstVariant;
  let soldOut = true;
  let preorder = false;
  for (let i = 0; i < cardProduct.variants.nodes.length; i++) {
    if (cardProduct.variants.nodes[i].availableForSale) {
      soldOut = false;
      if (cardProduct.variants.nodes[i].currentlyNotInStock) {
        preorder = true;
      }
    }
  }

  if (label) {
    cardLabel = label;
  } else if (soldOut == true) {
    cardLabel = 'SOLD OUT';
  } else if (isDiscounted(price, compareAtPrice)) {
    cardLabel = 'SALE';
  } else if (preorder == true) {
    cardLabel = 'PREORDER NOW';
  }

  return (
    <div className="grid gap-2 relative">
      <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="intent"
      >
        <div className={clsx('grid gap-4', className)}>
          <div className="aspect-[4/5] bg-primary/5 h-auto w-full relative border border-gray-100">
            {image && (
              <Image
                className="object-cover opacity-100 hover:opacity-0 transition-opacity duration-100 z-20 absolute top-0 left-0 w-full"
                aspectRatio="4/5"
                data={image}
                alt={image?.altText || `Picture of ${product.title}`}
                loading={loading}
              />
            )}
            {backImage && (
              <Image
                className="object-cover hover:opacity-100 transition-opacity duration-100 z-30 absolute top-0 left-0 opacity-0 w-full"
                aspectRatio="4/5"
                data={backImage}
                alt={image?.altText || `Picture of ${product.title}`}
                loading={loading}
              />
            )}
            {backVideo && (
              <Video
                className="object-cover w-full transition-opacity duration-100 z-30 aspect-[4/5] absolute top-0 left-0 border-2 border-white hover:opacity-100 opacity-0"
                data={backVideo}
                alt={image?.altText || `Picture of ${product.title}`}
                loading={loading}
                autoPlay={true}
                muted={true}
                loop={true}
                controls={false}
                playsInline={true}
              />
            )}
          </div>
          <div className="bg-black text-white font-bold font-nimubs rounded-sm absolute top-0 left-0 m-2 px-1 z-[35]">
            <span>{cardLabel}</span>
          </div>
          <div className="grid gap px-2">
            <h3 className="w-full overflow-hidden whitespace-nowrap text-ellipsis font-bold text-[80%] font-sans">
              {product.title}
            </h3>
            <div className="flex gap-4 ">
              <span className="flex gap-4 text-[0.69rem] pb-5">
                <Money withoutTrailingZeros data={price} />
                {isDiscounted(price, compareAtPrice) && (
                  <CompareAtPrice
                    className={'opacity-50'}
                    data={compareAtPrice}
                  />
                )}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function CompareAtPrice({data, className}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
