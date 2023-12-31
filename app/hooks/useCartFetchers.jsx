import {useFetchers} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';

export function useCartFetchers(actionName) {
  const fetchers = useFetchers();
  const cartFetchers = [];

  for (const fetcher of fetchers) {
    const formData = fetcher.formData;
    if (formData) {
      const formInputs = CartForm.getFormInput(formData);
      if (formInputs.action === actionName && !formInputs.inputs.redirectTo) {
        cartFetchers.push(fetcher);
      }
    }
  }
  return cartFetchers;
}
