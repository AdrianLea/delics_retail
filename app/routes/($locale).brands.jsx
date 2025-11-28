import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {AnalyticsPageType} from '@shopify/hydrogen';

import {PageHeader, Section, Text, Grid, Link} from '~/components';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';

export const headers = routeHeaders;

export async function loader({request, context}) {
  // Fetch all collections with consignment brand metafields
  const {collections} = await context.storefront.query(
    BRANDS_COLLECTIONS_QUERY,
    {
      variables: {
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    },
  );
  // Filter collections that have the consignmentbrand metafield set to true
  const brandCollections = collections.nodes
    .map((collection, idx) => {
      const mfs = Array.isArray(collection.metafields)
        ? collection.metafields.filter(Boolean)
        : [];

      const getMf = (key) => mfs.find((m) => m && m.key === key);

      const isConsignmentBrand = getMf('consignmentbrand')?.value === 'true';
      const brandImage = getMf('consignmentimage')?.reference?.image;

      return {
        collection,
        isConsignmentBrand,
        brandImage,
        originalIndex: idx,
      };
    })
    .filter((item) => item.isConsignmentBrand);

  const seo = seoPayload.page({
    page: {
      title: 'Brands',
      seo: {
        title: 'Our Consignment Brands',
        description:
          'Discover our carefully curated selection of consignment brands.',
      },
    },
    url: request.url,
  });

  return json({
    brandCollections,
    analytics: {
      pageType: AnalyticsPageType.page,
    },
    seo,
  });
}

export default function BrandsPage() {
  const {brandCollections} = useLoaderData();

  return (
    <>
      <PageHeader heading="OUR BRANDS">
        <div className="flex items-baseline justify-center w-full">
          <Text
            format
            width="narrow"
            as="p"
            className="inline-block text-center"
          >
            Discover our carefully curated selection of consignment brands.
          </Text>
        </div>
      </PageHeader>

      {!brandCollections || brandCollections?.length === 0 ? (
        <Section>
          <Text className="text-center m-auto py-10">
            No brands currently available.
          </Text>
        </Section>
      ) : (
        <Section>
          <Grid
            className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            layout="default"
          >
            {brandCollections.map((item) => (
              <BrandWidget
                key={item.collection.id}
                collection={item.collection}
                brandImage={item.brandImage}
              />
            ))}
          </Grid>
        </Section>
      )}
    </>
  );
}

function BrandWidget({collection, brandImage}) {
  const collectionUrl = new URL(collection.onlineStoreUrl).pathname;

  return (
    <Link
      to={collectionUrl}
      className="group relative overflow-hidden rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 aspect-square"
    >
      {/* Background Image */}
      {brandImage ? (
        <img
          src={brandImage.url}
          alt={brandImage.altText || collection.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center">
          <Text className="text-gray-400 text-sm">No Logo</Text>
        </div>
      )}

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Text Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-white">
        <h3 className="text-center font-bold text-xl mb-2 drop-shadow-lg">
          {collection.title}
        </h3>

        {collection.description && (
          <Text className="text-center text-sm text-white/90 mb-3 line-clamp-2 drop-shadow">
            {collection.description}
          </Text>
        )}

        <div className="text-sm font-medium group-hover:underline">
          Shop Now →
        </div>
      </div>
    </Link>
  );
}

// Query to fetch collections with consignment brand metafields
const BRANDS_COLLECTIONS_QUERY = `#graphql
  query BrandsCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 100) {
      nodes {
        id
        title
        handle
        description
        onlineStoreUrl
        metafields(identifiers: [
          {namespace: "custom", key: "consignmentbrand"},
          {namespace: "custom", key: "consignmentimage"}
        ]) {
          key
          value
          namespace
          reference {
            ... on MediaImage {
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;
