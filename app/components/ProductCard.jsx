import clsx from 'clsx';
import {flattenConnection, Image, Money, useMoney, Video} from '@shopify/hydrogen';

import {Text, Link, AddToCartButton, Button} from '~/components';
import {isDiscounted, isNewArrival} from '~/lib/utils';
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
  /*
    if (label) {
      cardLabel = label;
    } else if (isDiscounted(price, compareAtPrice)) {
      cardLabel = 'Sale';
    } else if (isNewArrival(product.publishedAt)) {
      cardLabel = 'New';
    }
  */

  const productAnalytics = {
    productGid: product.id,
    variantGid: firstVariant.id,
    name: product.title,
    variantName: firstVariant.title,
    brand: product.vendor,
    price: firstVariant.price.amount,
    quantity: 1,
  };

  return (
    <div className="grid gap-2">
      <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="intent"
      >
        <div className={clsx('grid gap-4', className)}>
          <div className="aspect-[4/5] bg-primary/5 min-h-full relative border border-gray-100 border-b-0">
            {image && (
              <Image
                className="object-cover opacity-100 hover:opacity-0 transition duration-100 z-20 absolute top-0 left-0"
                sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
                aspectRatio="4/5"
                data={image}
                alt={image.altText || `Picture of ${product.title}`}
                loading={loading}
              />
            )}
            {backImage && (
              <Image
                className="object-contain hover:opacity-100 transition duration-100 z-30 absolute top-0 left-0 opacity-0"
                sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
                aspectRatio="4/5"
                data={backImage}
                alt={image.altText || `Picture of ${product.title}`}
                loading={loading}
              />
            )}
            {backVideo && (
              <Video
                className="object-cover w-full h-full transition duration-100 z-30 aspect-[4/5] absolute top-0 left-0 border-2 border-white hover:opacity-100 opacity-0"
                data={backVideo}
                alt={image.altText || `Picture of ${product.title}`}
                loading={loading}
                autoPlay={true}
                muted={true}
                loop={true}
                controls={false}
                playsInline={true}
              />
            )}
            <Text
              as="label"
              size="fine"
              className="absolute top-0 right-0 p-4 text-right text-notice"
            >
              {cardLabel}
            </Text>
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
      {quickAdd && firstVariant.availableForSale && (
        <AddToCartButton
          lines={[
            {
              quantity: 1,
              merchandiseId: firstVariant.id,
            },
          ]}
          variant="secondary"
          className="mt-2"
          analytics={{
            products: [productAnalytics],
            totalValue: parseFloat(productAnalytics.price),
          }}
        >
          <Text as="span" className="flex items-center justify-center gap-2">
            Add to Cart
          </Text>
        </AddToCartButton>
      )}
      {quickAdd && !firstVariant.availableForSale && (
        <Button variant="secondary" className="mt-2" disabled>
          <Text as="span" className="flex items-center justify-center gap-2">
            Sold out
          </Text>
        </Button>
      )}
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
