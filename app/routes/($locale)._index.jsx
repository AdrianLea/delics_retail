import {defer} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType} from '@shopify/hydrogen';

import {ProductSwimlane} from '~/components';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import Slider from '~/components/Slider';

export const headers = routeHeaders;

export async function loader({params, context}) {
  const {language, country} = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the locale URL param is defined, yet we still are on `EN-US`
    // the the locale param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  const {shop} = await context.storefront.query(HOMEPAGE_SEO_QUERY);

  const seo = seoPayload.home();

  return defer({
    shop,
    slider_images: context.storefront.query(HOMEPAGE_SLIDER_QUERY),

    featuredProducts: context.storefront.query(
      HOMEPAGE_FEATURED_PRODUCTS_QUERY,
      {
        variables: {
          first: 1,
        },
      },
    ),
    analytics: {
      pageType: AnalyticsPageType.home,
    },
    seo,
  });
}

export default function Homepage() {
  const {featuredProducts} = useLoaderData();
  const {slider_images} = useLoaderData();
  return (
    <>
      {slider_images && (
        <Suspense>
          <Await resolve={slider_images}>
            {(images) => {
              if (!images?.collections?.nodes) return <></>;
              return (
                <Slider
                  images={images}
                  className={
                    'overflow-hidden w-[100%] h-screen bg-gray-600 absolute top-0 left-0'
                  }
                />
              );
            }}
          </Await>
        </Suspense>
      )}
      <div className="w-full h-screen -mt-[92px] md:-mt-[140px] bg-gray-100"></div>
      <section
        className={`flex flex-row w-full flex-wrap items-center justify-center p-2 bg-gray-100 border-b border-gray-300`}
      >
        <div className="max-w-[600px] items-center py-2">
          <h2 className="text-center font-bold text-2xl">About Us</h2>
          <p className="py-7 px-1 font-sans text-center">
            DEL’CS WORLD is a female-owned Malaysian brand launched in February
            2023. We started as a low-key curated thrift store at our little
            retail space DEL’CS RETAIL in Taman Paramount in 2020. Since then,
            the community around DEL’CS has grown tremendously, which cultivated
            our love to serve you guys the most fashionable pieces with the
            utmost quality.
          </p>
        </div>
      </section>
      {featuredProducts && (
        <Suspense>
          <Await resolve={featuredProducts}>
            {({collections}) => {
              if (!collections.nodes[0].products.nodes) return <></>;
              return (
                <ProductSwimlane
                  products={collections.nodes[0].products}
                  title="Shop Our Latest"
                  count={4}
                />
              );
            }}
          </Await>
        </Suspense>
      )}
    </>
  );
}

const HOMEPAGE_SLIDER_QUERY = `query heroimagesquery {
  collections(
    first: 15
  ) {
    nodes {
      metafields(
        identifiers: [{namespace: "custom", key: "herodesktop"}, {namespace: "custom", key: "heromobile"}, {namespace: "custom", key: "herodescriptiontext"}, {namespace: "custom", key: "herobuttontext"}]
      ) {
        reference {
          ... on MediaImage {
            image {
              url
            }
          }
        }
        value
      }
      handle
      title
      onlineStoreUrl
      id
    }
  }
}`;

const HOMEPAGE_SEO_QUERY = `#graphql
  query seoCollectionContent($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop {
      name
      description
    }
  }
`;

export const HOMEPAGE_FEATURED_PRODUCTS_QUERY = `#graphql
  query homepageFeaturedProducts($country: CountryCode, $language: LanguageCode, $first: Int)
  @inContext(country: $country, language: $language) {
    collections(first: $first, sortKey: ID, reverse: true) {
      nodes {
        products(first: 10) {
          nodes {
            id
            ...ProductCard
          }
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;
