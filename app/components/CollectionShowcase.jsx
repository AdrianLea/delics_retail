import {useId} from 'react';
import {Image} from '@shopify/hydrogen';

import {ProductCard, Skeleton, Text, Grid, Link} from '~/components';

/**
 * Display a grid of products and a heading based on some options.
 * This components uses the storefront API products query
 * @param count number of products to display
 * @param query a filtering query
 * @param reverse wether to reverse the product results
 * @param sortKey Sort the underlying list by the given key.
 * @see query https://shopify.dev/api/storefront/2023-07/queries/products
 * @see filters https://shopify.dev/api/storefront/2023-07/queries/products#argument-products-query
 */
export function CollectionShowcase({
  count = 4,
  heading = 'Shop Best Sellers',
  reverse,
  sortKey = 'BEST_SELLING',
  products,
  image,
  to,
}) {
  return (
    <div className="mb-5">
      <Link to={to}>
        <Image
          className={`w-full h-full object-cover  mx-auto md:aspect-[12/5] aspect-[1/1]`}
          src={image.url}
          loading="lazy"
        ></Image>
      </Link>
      <div className="grid lg:w-[95%] 2xl:w-[1200px] mx-auto gap-x-6 gap-y-8 my-5">
        <CollectionShowcaseContent count={count} products={products} />
      </div>

      <div className="flex justify-center mb-[72px]">
        <Link
          className="flex items-center justify-center text-center bg-black text-white hover:bg-transparent border hover:text-black w-[125px] h-[40px] text-md font-semibold shadow-sm rounded-md m-auto"
          to={to}
        >
          VIEW ALL
        </Link>
      </div>
    </div>
  );
}

/**
 * Render the FeaturedProducts content based on the fetcher's state. "loading", "empty" or "products"
 */
function CollectionShowcaseContent({count = 4, products}) {
  const id = useId();
  if (!products) {
    return (
      <>
        {[...new Array(count)].map((_, i) => (
          <div key={`${id + i}`} className="grid gap-2">
            <Skeleton className="aspect-[3/4]" />
            <Skeleton className="w-32 h-4" />
          </div>
        ))}
      </>
    );
  }

  if (products?.length === 0) {
    return <Text format>No products found.</Text>;
  }

  return (
    <>
      <Grid layout="products">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} quickAdd />
        ))}
      </Grid>
    </>
  );
}
