import {defer} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType} from '@shopify/hydrogen';
import BeholdWidget from '@behold/react';

import {CollectionShowcase, ProductCard, Grid, Link} from '~/components';
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
  const homepageCollectionList = [
    'Sleepy Student 📓♡',
    'Trophy Wives',
    'LOVESICK',
  ];

  const collectionShowcasePromises = homepageCollectionList.map((collection) =>
    context.storefront.query(HOMEPAGE_COLLECTION_SHOWCASE_QUERY, {
      variables: {
        collectionName: `title:${collection}`,
      },
    }),
  );

  const collectionShowcaseImagesPromises = homepageCollectionList.map(
    (collection) =>
      context.storefront.query(COLLECTION_SHOWCASE_IMAGE_QUERY, {
        variables: {
          collectionName: `title:${collection}`,
        },
      }),
  );

  const collectionShowcaseData = await Promise.all([
    ...collectionShowcasePromises,
    ...collectionShowcaseImagesPromises,
  ]);

  const seo = seoPayload.home();

  return defer({
    shop,
    slider_images: context.storefront.query(HOMEPAGE_SLIDER_QUERY),
    collectionShowcaseData,
    newArrivalProducts: context.storefront.query(
      HOMEPAGE_FEATURED_PRODUCTS_QUERY,
    ),
    featuredProducts: context.storefront.query(HOMEPAGE_BEST_SELLING_QUERY),
    analytics: {
      pageType: AnalyticsPageType.home,
    },
    seo,
  });
}

export default function Homepage() {
  const {featuredProducts} = useLoaderData();
  const {slider_images} = useLoaderData();
  const {collectionShowcaseData} = useLoaderData();
  const {newArrivalProducts} = useLoaderData();

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
      <div className="w-full h-screen -mt-[92px] md:-mt-[140px] bg-gray-100 mb-5"></div>
      {/* <div className="my-[200px] md:w-[90%] mx-auto">
        <h1 className="text-[40px] text-center font-bold">
          What is Del'cs World?
        </h1>
        <br></br>
        <p className="text-[20px] text-center">
          DEL’CS WORLD is a female fashion label born and based in Kuala Lumpur,
          Malaysia.
        </p>
        <br></br>
        <p className="text-[20px] text-center">
          The average DEL’CS wearer is the effortlessly cool girl you walked
          past on the streets last week who you can’t stop thinking about.
          They’re probably the best dressed in the room and yes, you should’ve
          asked from their Instagram.
        </p>
        <br></br>
        <p className="text-[20px] text-center">
          They’re probably the best dressed in the room and yes, you should’ve
          asked from their Instagram. Created by Youths, For Youths — our brand
          creates staple quality pieces to bring young fashionable people
          together for any occasion from lounging around after school to going
          to a weekend pilates sesh, or a night out with your best friends.
        </p>
      </div> */}

      {newArrivalProducts && (
        <Suspense>
          <Await resolve={newArrivalProducts}>
            {({collections}) => {
              return (
                <FeaturedProductsSection
                  products={collections.nodes[0].products.nodes}
                  title={'NEW ARRIVALS'}
                  to={'/collections/new-arrivals'}
                />
              );
            }}
          </Await>
        </Suspense>
      )}

      {featuredProducts && (
        <Suspense>
          <Await resolve={featuredProducts}>
            {({products}) => {
              return (
                <FeaturedProductsSection
                  products={products.nodes}
                  title={'BEST SELLERS'}
                  to={'/collections/delcs-world-vol-2?sort=best-selling'}
                />
              );
            }}
          </Await>
        </Suspense>
      )}

      <section>
        <Suspense>
          <Await resolve={collectionShowcaseData}>
            {(data) => {
              const halfLength = data.length / 2;
              const collectionShowcaseProducts = data.slice(0, halfLength);
              const collectionShowcaseImages = data.slice(halfLength);
              return collectionShowcaseProducts.map((resolve, index) => (
                <CollectionShowcase
                  count={4}
                  products={resolve.collections.nodes[0].products.nodes}
                  key={`key-${index}-1`}
                  image={
                    collectionShowcaseImages[index].collections.nodes[0]
                      .metafields[0]?.reference.image
                  }
                  to={
                    new URL(resolve.collections.nodes[0].onlineStoreUrl)
                      .pathname
                  }
                  heading={`${resolve.collections.nodes[0].title.toUpperCase()} COLLECTION`}
                />
              ));
            }}
          </Await>
        </Suspense>
      </section>

      <p className="mx-auto font-bold text-3xl mt-28 mb-14 text-center">
        FIND US @DELICSWORLD
      </p>
      <BeholdWidget feedId="lCjTMJ133zOPNzQ4j9mu" />
      <div className="m-14" />
    </>
  );
}

function FeaturedProductsSection({title, products, to}) {
  const filteredProducts = products
    .filter((product) => product.availableForSale)
    .slice(0, 8);
  return (
    <>
      <h2 className="mx-auto font-bold text-3xl my-28 text-center">{title}</h2>
      <div className={`grid w-[95%] mx-auto gap-x-6 gap-y-8`}>
        <Grid layout="products">
          {filteredProducts.map((product) => (
            <ProductCard product={product} key={product.id} quickAdd />
          ))}
        </Grid>
        <Link
          className="flex items-center justify-center text-center bg-black text-white hover:bg-transparent border hover:text-black w-[125px] h-[40px] text-md font-semibold shadow-sm rounded-md m-auto"
          to={to}
        >
          VIEW ALL
        </Link>
      </div>
    </>
  );
}

const HOMEPAGE_SLIDER_QUERY = `#graphql
query heroimagesquery {
  collections(
    first: 30
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

const COLLECTION_SHOWCASE_IMAGE_QUERY = `#graphql
query collectionShowcaseImageQuery($collectionName: String!) {
  collections(
    first:1
    query:$collectionName
  ) {
    nodes {
      metafields(
        identifiers: [{namespace: "custom", key: "collectionspageimage"}]
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
  query homepageFeaturedProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 1, query:"title:New Arrivals", reverse: true) {
      nodes {
        products(first: 20, sortKey: CREATED, reverse: true) {
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

export const HOMEPAGE_BEST_SELLING_QUERY = `#graphql
  query homepageBestSelling($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 20, sortKey: BEST_SELLING) {
      nodes {
        id
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const HOMEPAGE_COLLECTION_SHOWCASE_QUERY = `#graphql
      query collectionShowcaseQuery($country: CountryCode, $language: LanguageCode, $collectionName: String!)
      @inContext(country: $country, language: $language) {
        collections(first: 1, query:$collectionName , reverse: false) {
          nodes {
            products(first: 20, sortKey: BEST_SELLING) {
              nodes {
                id
                ...ProductCard
              }
            }
            onlineStoreUrl
            title
          }
        }
      }
      ${PRODUCT_CARD_FRAGMENT}
    `;
