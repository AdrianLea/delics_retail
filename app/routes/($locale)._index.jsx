import {defer} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {
  Await,
  useLoaderData,
  useMatches,
  useRouteLoaderData,
} from '@remix-run/react';
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

  const seo = seoPayload.root();

  return defer({
    shop,
    slider_images: context.storefront.query(HOMEPAGE_SLIDER_QUERY),

    featuredProducts: context.storefront.query(
      HOMEPAGE_FEATURED_PRODUCTS_QUERY,
      {
        variables: {
          /**
           * Country and language properties are automatically injected
           * into all queries. Passing them is unnecessary unless you
           * want to override them from the following default:
           */
          country,
          language,
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
  const matches = useMatches()
  const {layout} = useRouteLoaderData(matches[0].id)
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
                  links={layout?.headerMenu.items}
                  className={
                    'overflow-hidden w-[100%] h-screen bg-gray-600 absolute top-0 left-0'
                  }
                />
              );
            }}
          </Await>
        </Suspense>
      )}
      <div className="w-full h-screen bg-gray-100"></div>
      <section
        className={`flex flex-row w-full flex-wrap items-center justify-center p-2 bg-gray-100 border-b border-gray-300`}
      >
        <div className="max-w-[600px] items-center py-2">
          <h2 className="text-center font-bold text-2xl">About Us</h2>
          <p className="py-7 px-1 font-sans text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
            quam ligula, porta fringilla orci at, condimentum euismod dui.
            Quisque eleifend non libero sit amet consectetur. Donec placerat
            erat eu nulla cursus aliquet. Integer in volutpat mauris. Vivamus
            gravida tincidunt sapien, et viverra est ultrices et. In hac
            habitasse platea dictumst. Vestibulum posuere ac quam quis
            imperdiet. Nam condimentum sodales porttitor. Quisque lectus lorem,
            pulvinar quis enim eu, blandit tempus ante. Aenean nec ullamcorper
            enim. Vivamus iaculis nibh in sapien vulputate mollis. Nam risus
            ante, lobortis eu tellus vel, ultrices ultrices urna.
          </p>
        </div>
      </section>
      {featuredProducts && (
        <Suspense>
          <Await resolve={featuredProducts}>
            {({products}) => {
              if (!products?.nodes) return <></>;
              return (
                <ProductSwimlane
                  products={products}
                  title="Featured Products"
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
    first: 20
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
  query homepageFeaturedProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 8) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;
