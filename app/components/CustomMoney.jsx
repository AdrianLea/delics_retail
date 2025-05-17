import React from 'react';
import {Money as ShopifyMoney} from '@shopify/hydrogen-react';
import {useMatches} from '@remix-run/react';

// Define exchange rates with MYR as the base currency
const exchangeRates = {
  MYR: 1, // Base currency
  USD: 0.22, // 1 MYR = 0.22 USD (or 1 USD = 4.50 MYR)
  AUD: 0.33, // 1 MYR = 0.33 AUD (or 1 AUD = 3.00 MYR)
  SGD: 0.3, // 1 MYR = 0.30 SGD (or 1 SGD = 3.30 MYR)
};

export function CustomMoney({data, ...props}) {
  const [root] = useMatches();
  const {currency: localeCurrency} = root?.data.selectedLocale
    ? root.data.selectedLocale
    : {currency: 'MYR'}; // Get the current locale's currency

  // First convert the amount to MYR (if it's not already in MYR)
  const amountInMYR =
    data.currencyCode === 'MYR'
      ? parseFloat(data.amount)
      : parseFloat(data.amount) / exchangeRates[data.currencyCode];

  // Then convert from MYR to the local currency
  const convertedAmount = (amountInMYR * exchangeRates[localeCurrency]).toFixed(
    2,
  );

  // Create the adjusted data object
  const adjustedData = {
    ...data,
    amount: convertedAmount,
    currencyCode: localeCurrency,
  };

  return (
    <ShopifyMoney
      {...props}
      data={adjustedData} // Pass the adjusted data to ShopifyMoney
      withoutCurrency={props.withoutCurrency ?? false}
      withoutTrailingZeros={props.withoutTrailingZeros ?? true}
    />
  );
}
