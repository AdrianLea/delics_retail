import {useEffect} from 'react';
import {useAnalytics} from '@shopify/hydrogen';

function trackViewedProduct(payload) {
  var _learnq = window._learnq || [];
  payload = payload.products[0];
  var product = {
    Name: payload.title,
    ProductID: payload.id,
    Categories:
      payload.collections == undefined
        ? null
        : payload.collections.nodes.map((a) => a.title),
    ImageURL: payload.imageURL,
    URL: payload.url,
    Brand: payload.vendor,
    Price: payload.price,
    CompareAtPrice: payload.compareAtPrice,
  };
  _learnq.push(['track', 'Viewed Product', product]);
}

function trackViewedItem(payload) {
  var _learnq = window._learnq || [];
  var item = {
    Title: payload.title,
    ItemId: payload.id,
    Categories:
      payload.collections == undefined
        ? null
        : payload.product.collections.nodes.map((a) => a.title),
    ImageUrl: payload.imageURL,
    Url: payload.url,
    Metadata: {
      Brand: payload.vendor,
      Price: payload.price,
      CompareAtPrice: payload.compareAtPrice,
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

export function KlaviyoOnsite() {
  const {subscribe, register} = useAnalytics();
  const {ready} = register('Third Party Analytics Integration');

  useEffect(() => {
    subscribe('cart_updated', (payload) => {
      trackAddToCart(payload);
    });

    subscribe('product_viewed', (payload) => {
      trackViewedProduct(payload);
      trackViewedItem(payload);
    });
    ready();
  }, []);
  return null;
}
