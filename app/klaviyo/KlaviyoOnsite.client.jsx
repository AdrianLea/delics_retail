import {useEffect} from 'react';
import {ClientAnalytics, useLoadScript} from '@shopify/hydrogen';

const PUBLIC_KEY = 'API_KEY';
const URL = `//static.klaviyo.com/onsite/js/klaviyo.js?company_id=${PUBLIC_KEY}`;
let init = false;

function trackViewedProduct(product) {
  const klaviyo_product = {
    Name: product.title,
    ProductID: product.id,
    Categories:
      product.collections == undefined
        ? null
        : product.collections.nodes.map((node) => node.title),
    ImageURL: product.selectedVariant.image.url,
    URL: product.url,
    Brand: product.vendor,
    Price: product.selectedVariant.price.amount,
    CompareAtPrice: product.selectedVariant.compareAtPrice?.amount,
  };
  window._learnq = window._learnq || [];
  window._learnq.push(['track', 'Viewed Product', klaviyo_product]);
}

function trackViewedItem(payload) {
  var _learnq = window._learnq || [];
  var item = {
    Title: payload.title,
    ItemId: payload.product.id.substring(
      payload.product.id.lastIndexOf('/') + 1,
    ),
    Categories:
      payload.collections == undefined
        ? null
        : payload.product.collections.edges.map((a) => a.node.title),
    ImageUrl: payload.selectedVariant.image.url,
    Url: payload.url,
    Metadata: {
      Brand: payload.vendor,
      Price: payload.selectedVariant.priceV2.amount,
      CompareAtPrice: payload.selectedVariant.compareAtPriceV2.amount,
    },
  };
  _learnq.push(['trackViewedItem', item]);
}

function trackAddToCart(payload) {
  var _learnq = window._learnq || [];
  var cart = {
    total_price: payload.cart.cost.totalAmount.amount,
    $value: payload.cart.cost.totalAmount.amount,
    original_total_price: payload.cart.cost.subtotalAmount.amount,
    items: payload.cart.lines,
  };

  _learnq.push(['track', 'Added to Cart', cart]);
}

export default function KlaviyoOnsite() {
  useEffect(() => {
    if (!init) {
      init = true;
      useLoadScript(URL);
      ClientAnalytics.subscribe(
        ClientAnalytics.eventNames.ADD_TO_CART,
        (payload) => {
          trackAddToCart(payload);
        },
      );

      ClientAnalytics.subscribe(
        ClientAnalytics.eventNames.VIEWED_PRODUCT,
        (payload) => {
          trackViewedProduct(payload);
          trackViewedItem(payload);
        },
      );
    }
  });
  return null;
}
