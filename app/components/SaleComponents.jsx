import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

import {Heading, Text, Grid, ProductCard} from '~/components';
import {getImageLoadingPriority} from '~/lib/const';

/**
 * Component for displaying a sale collection with its products
 */
export function SaleCollection({collection, index = 0}) {
  if (!collection || !collection.products.nodes.length) return null;

  return (
    <div className="sale-collection">
      <div className="flex items-center justify-between mb-6">
        <Heading as="h2" size="heading">
          {collection.title} Sale
        </Heading>
        <Link
          to={`/collections/${collection.handle}`}
          className="text-sm font-medium underline hover:no-underline"
        >
          View all
        </Link>
      </div>

      {collection.products.nodes.length > 0 ? (
        <Grid layout="products">
          {collection.products.nodes.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              loading={getImageLoadingPriority(i)}
              quickAdd
            />
          ))}
        </Grid>
      ) : (
        <Text className="text-center">
          No sale items available in this collection.
        </Text>
      )}
    </div>
  );
}

/**
 * Component for displaying a featured sale banner with image and call to action
 */
export function SaleBanner({title, description, image, link}) {
  return (
    <div className="sale-banner relative overflow-hidden rounded-lg mb-12">
      {image && (
        <div className="w-full h-full">
          <Image
            data={image}
            alt={title}
            className="object-cover w-full h-full"
            sizes="(min-width: 1024px) 50vw, 100vw"
            loading="eager"
          />
        </div>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 py-8 bg-black bg-opacity-40 text-white">
        <Heading as="h2" size="display" className="text-white">
          {title}
        </Heading>
        {description && (
          <Text className="text-white max-w-md mt-4">{description}</Text>
        )}
        {link && (
          <Link
            to={link}
            className="mt-6 px-6 py-3 rounded bg-white text-black font-bold hover:bg-opacity-90 transition-colors"
          >
            Shop Now
          </Link>
        )}
      </div>
    </div>
  );
}
