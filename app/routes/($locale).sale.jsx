import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {flattenConnection, AnalyticsPageType} from '@shopify/hydrogen';
import {useEffect} from 'react';

import {
  PageHeader,
  Section,
  Text,
  Heading,
  Grid,
  ProductCard,
} from '~/components';
// Sale components are available for future use
// import {SaleCollection, SaleBanner} from '~/components/SaleComponents';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {getImageLoadingPriority} from '~/lib/const';

export const headers = routeHeaders;

export async function loader({request, context}) {
  // Get sale collections from the storefront API
  const {collections} = await context.storefront.query(SALE_COLLECTIONS_QUERY, {
    variables: {
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  const collectionsToShow = collections.nodes.filter((collection) => {
    // Check if the collection has the showonsale metafield and its value is true
    const showOnSaleMetafield = collection.metafields?.find(
      (metafield) =>
        metafield?.namespace === 'custom' && metafield?.key === 'showonsale',
    );
    return showOnSaleMetafield?.value === 'true';
  });

  // Fetch products on sale for each collection
  const collectionsWithSaleProducts = await Promise.all(
    collectionsToShow.map(async (collection) => {
      const {collection: collectionWithProducts} =
        await context.storefront.query(COLLECTION_PRODUCTS_ON_SALE_QUERY, {
          variables: {
            handle: collection.handle,
            country: context.storefront.i18n.country,
            language: context.storefront.i18n.language,
          },
        });

      // Additional filter to ensure products have compareAtPrice > price
      // and are actually in stock
      const saleProducts = {
        nodes:
          collectionWithProducts?.products?.nodes.filter((product) => {
            // Get the first variant
            const variant = product.variants?.nodes[0];
            if (!variant) return false;

            // Check if compareAtPrice exists and is higher than price
            const isOnSale =
              variant.compareAtPrice &&
              variant.price &&
              parseFloat(variant.compareAtPrice.amount) >
                parseFloat(variant.price.amount);

            return product.availableForSale && isOnSale;
          }) || [],
      };

      return {
        ...collection,
        products: saleProducts,
      };
    }),
  );

  // Filter out collections with no sale products
  const saleCollections = collectionsWithSaleProducts.filter(
    (collection) => collection.products.nodes.length > 0,
  );
  const seo = seoPayload.page({
    page: {
      title: 'Sale',
      seo: {
        title: 'Sale',
        description: 'Shop our items on sale across all collections',
      },
    },
    url: request.url,
  });

  return json({
    saleCollections,
    analytics: {
      pageType: AnalyticsPageType.page,
    },
    seo,
  });
}

export default function SalePage() {
  const {saleCollections} = useLoaderData();

  return (
    <>
      <PageHeader heading="Sale">
        <div className="flex items-baseline justify-center w-full">
          <Text
            format
            width="narrow"
            as="p"
            className="inline-block text-center"
          >
            Shop our best deals across all collections.
          </Text>
        </div>
      </PageHeader>

      {!saleCollections || saleCollections?.length === 0 ? (
        <Section>
          <Text className="text-center m-auto py-10">
            No sale items currently available.
          </Text>
        </Section>
      ) : (
        saleCollections.map((collection, index) => (
          <Section key={collection.id} divider={index > 0}>
            <Heading as="h2" className="mx-auto">
              {collection.title} Sale
            </Heading>
            <Grid layout="products">
              {collection.products.nodes.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  loading={getImageLoadingPriority(i)}
                />
              ))}
            </Grid>
          </Section>
        ))
      )}
    </>
  );
}

// Query to fetch all collections with showonsale metafield
const SALE_COLLECTIONS_QUERY = `#graphql
  query SaleCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 20) {
      nodes {
        id
        title
        handle
        description
        metafields(identifiers: [{namespace: "custom", key: "showonsale"}]) {
          key
          value
          namespace
        }
      }
    }
  }
`;

// Query to fetch sale products from a specific collection
const COLLECTION_PRODUCTS_ON_SALE_QUERY = `#graphql
  query CollectionProductsOnSale($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(
        first: 100,
      ) {
        nodes {
          availableForSale,
          ...ProductCard
          
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;
