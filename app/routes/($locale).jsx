import {redirect} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';

import {countries} from '~/data/countries';

export const action = async ({request, context}) => {
  const {session, storefront} = context;
  const formData = await request.formData();

  // Make sure the form request is valid
  const languageCode = formData.get('language');
  invariant(languageCode, 'Missing language');

  const countryCode = formData.get('country');
  invariant(countryCode, 'Missing country');

  // determine where to redirect to relative to where user navigated from
  // ie. hydrogen.shop/collections -> ca.hydrogen.shop/collections
  const path = formData.get('path');
  const toLocale = countries[`/${languageCode}-${countryCode}`.toLowerCase()];
  const newLocale = {language: languageCode, country: countryCode};
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

  const redirectUrl = new URL(
    `${toLocale.pathPrefix || ''}${path}`,
    `http://${toLocale.host}`,
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
