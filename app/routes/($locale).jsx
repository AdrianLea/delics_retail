import {redirect} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';

import {countries} from '~/data/countries';

export const loader = async ({request, context}) => {
  const {storefront} = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Get the locale from the context
  const {pathPrefix} = storefront.i18n;

  // If the path is exactly the locale prefix (e.g., /au, /sg), redirect to index
  if (path === pathPrefix) {
    return redirect(`${pathPrefix}/`, 302);
  }

  // Continue with normal root loader logic
  return {};
};

export const action = async ({request, context}) => {
  const {session, storefront} = context;
  const formData = await request.formData();

  // Make sure the form request is valid
  const languageCode = formData.get('language');
  invariant(languageCode, 'Missing language');

  const countryCode = formData.get('country');
  invariant(countryCode, 'Missing country');

  // determine where to redirect to relative to where user navigated from
  const path = formData.get('path');

  // First check if the specific country key exists
  const localeKey = `/${languageCode}-${countryCode}`.toLowerCase();
  let toLocale = countries[localeKey];

  // If the locale doesn't exist in our map, check if it's the default locale
  if (!toLocale && countryCode === countries.default.country) {
    toLocale = countries.default;
  }

  // If still no locale found, fallback to default
  if (!toLocale) {
    console.error(`Locale not found for ${localeKey}, falling back to default`);
    toLocale = countries.default;
  }

  const newLocale = {
    language: languageCode,
    country: countryCode,
    currency: toLocale.currency,
    pathPrefix: toLocale.pathPrefix,
  };

  storefront.i18n = newLocale;
  const cartId = await session.get('cartId');

  // Update cart buyer's country code if there is a cart id
  if (cartId) {
    await updateCartBuyerIdentity(context, {
      cartId,
      buyerIdentity: {
        countryCode,
      },
    });
  }

  // Use the host from the locale object, fallback to request host
  const host = toLocale.host || new URL(request.url).host;

  const redirectUrl = new URL(
    `${toLocale.pathPrefix || ''}${path}`,
    `http://${host}`,
  );

  return redirect(redirectUrl, 302);
};

async function updateCartBuyerIdentity({storefront}, {cartId, buyerIdentity}) {
  const data = await storefront.mutate(UPDATE_CART_BUYER_COUNTRY, {
    variables: {
      cartId,
      buyerIdentity,
    },
  });
  return data;
}

const UPDATE_CART_BUYER_COUNTRY = `#graphql
  mutation CartBuyerIdentityUpdate(
    $cartId: ID!
    $buyerIdentity: CartBuyerIdentityInput!
  ) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        id
      }
    }
  }
`;
