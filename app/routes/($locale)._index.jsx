import {defer} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType} from '@shopify/hydrogen';

import {CollectionShowcase, ProductCard, Grid, Link} from '~/components';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import Slider from '~/components/Slider';

export const headers = routeHeaders;

/**
 * Validates and sanitizes a URL string
 * Returns the sanitized URL if valid, or null if invalid
 */
function sanitizeUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') return null;

  const trimmed = urlString.trim();
  if (!trimmed) return null;

  // If it starts with /, it's a relative URL - just validate it's not empty
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // If it doesn't start with http:// or https://, prepend https://
  let fullUrl = trimmed;
  if (!trimmed.match(/^https?:\/\//i)) {
    fullUrl = `https://${trimmed}`;
  }

  try {
    const url = new URL(fullUrl);
    // Only allow http and https protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return url.toString();
  } catch (e) {
    // Invalid URL
    return null;
  }
}

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

  // Fetch all collections with homepage metafields
  const {collections: allCollections} = await context.storefront.query(
    HOMEPAGE_SECTIONS_QUERY,
    {
      variables: {
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    },
  );
  // Filter and sort collections for homepage sections
  const homepageSections = allCollections.nodes
    .map((collection, idx) => {
      const mfs = Array.isArray(collection.metafields)
        ? collection.metafields.filter(Boolean)
        : [];
      const getMf = (key) => mfs.find((m) => m && m.key === key);

      const showOnHomepage = getMf('showonhomepage')?.value === 'true';
      const sectionType = getMf('homepagesectiontype')?.value || 'featured';
      const orderRaw = getMf('homepageordernumber')?.value;

      // Parse custom title and link
      const customTitle = getMf('homepagetitle')?.value || null;
      const customLinkRaw = getMf('homepagelink')?.value;
      const customLink = sanitizeUrl(customLinkRaw);

      let order;
      if (orderRaw != null && orderRaw !== '') {
        const parsed = parseInt(orderRaw, 10);
        if (!Number.isNaN(parsed)) order = parsed;
      }

      return {
        collection,
        showOnHomepage,
        sectionType,
        order,
        customTitle,
        customLink,
        originalIndex: idx,
      };
    })
    .filter((item) => item.showOnHomepage)
    .sort((a, b) => {
      const aKey =
        typeof a.order === 'number' ? a.order : Number.POSITIVE_INFINITY;
      const bKey =
        typeof b.order === 'number' ? b.order : Number.POSITIVE_INFINITY;
      if (aKey !== bKey) return aKey - bKey;
      return a.originalIndex - b.originalIndex;
    });

  const seo = seoPayload.home();

  return defer({
    shop,
    slider_images: context.storefront.query(HOMEPAGE_SLIDER_QUERY),
    homepageSections,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
    seo,
  });
}

export default function Homepage() {
  const {slider_images, homepageSections} = useLoaderData();

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

      {/* Dynamic homepage sections based on collection metafields */}
      {homepageSections.map((section, index) => {
        const {collection, sectionType, customTitle, customLink} = section;

        // Determine the display title
        const displayTitle = customTitle || collection.title.toUpperCase();

        // Determine the link URL
        const linkUrl =
          customLink || new URL(collection.onlineStoreUrl).pathname;

        if (sectionType === 'showcase') {
          return (
            <CollectionShowcase
              key={collection.id}
              count={4}
              products={collection.products.nodes}
              image={
                collection.metafields?.find(
                  (m) => m && m.key === 'collectionspageimage',
                )?.reference?.image
              }
              to={linkUrl}
              heading={
                customTitle ? displayTitle : `${displayTitle} COLLECTION`
              }
            />
          );
        }

        // Default to featured section type
        return (
          <FeaturedProductsSection
            key={collection.id}
            products={collection.products.nodes}
            title={displayTitle}
            to={linkUrl}
          />
        );
      })}

      <p className="mx-auto font-bold text-3xl mt-28 mb-14 text-center">
        FIND US @DELICSWORLD
      </p>
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
    first: 30,
    sortKey: ID,
  ) {
    nodes {
      metafields(
        identifiers: [{namespace: "custom", key: "herodesktop"}, {namespace: "custom", key: "heromobile"}, {namespace: "custom", key: "herodescriptiontext"}, {namespace: "custom", key: "herobuttontext"}, {namespace: "custom", key: "sliderordernumber"}]
      ) {
        reference {
          ... on MediaImage {
            image {
              url
            }
          }
        }
        value
        key
      }
      handle
      title
      onlineStoreUrl
      id
    }
  }
}`;

// Query to fetch collections with homepage metafields
const HOMEPAGE_SECTIONS_QUERY = `#graphql
  query HomepageSections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 50) {
      nodes {
        id
        title
        handle
        onlineStoreUrl
        metafields(identifiers: [
          {namespace: "custom", key: "showonhomepage"},
          {namespace: "custom", key: "homepagesectiontype"},
          {namespace: "custom", key: "homepageordernumber"},
          {namespace: "custom", key: "collectionspageimage"},
          {namespace: "custom", key: "homepagetitle"},
          {namespace: "custom", key: "homepagelink"}
        ]) {
          key
          value
          namespace
          reference {
            ... on MediaImage {
              image {
                url
              }
            }
          }
        }
        products(first: 20, sortKey: BEST_SELLING) {
          nodes {
            ...ProductCard
          }
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

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
