/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import * as CustomerAccountAPI from '@shopify/hydrogen/customer-account-api-types';

export type OrderFragmentFragment = Pick<
  CustomerAccountAPI.Order,
  'id' | 'number' | 'processedAt' | 'financialStatus'
> & {
  fulfillments: {nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>};
  totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
  lineItems: {
    edges: Array<{
      node: Pick<CustomerAccountAPI.LineItem, 'title'> & {
        image?: CustomerAccountAPI.Maybe<
          Pick<CustomerAccountAPI.Image, 'altText' | 'height' | 'url' | 'width'>
        >;
      };
    }>;
  };
};

export type AddressPartialFragment = Pick<
  CustomerAccountAPI.CustomerAddress,
  | 'id'
  | 'formatted'
  | 'firstName'
  | 'lastName'
  | 'company'
  | 'address1'
  | 'address2'
  | 'territoryCode'
  | 'zoneCode'
  | 'city'
  | 'zip'
  | 'phoneNumber'
>;

export type CustomerDetailsFragment = Pick<
  CustomerAccountAPI.Customer,
  'firstName' | 'lastName'
> & {
  phoneNumber?: CustomerAccountAPI.Maybe<
    Pick<CustomerAccountAPI.CustomerPhoneNumber, 'phoneNumber'>
  >;
  emailAddress?: CustomerAccountAPI.Maybe<
    Pick<CustomerAccountAPI.CustomerEmailAddress, 'emailAddress'>
  >;
  defaultAddress?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.CustomerAddress,
      | 'id'
      | 'formatted'
      | 'firstName'
      | 'lastName'
      | 'company'
      | 'address1'
      | 'address2'
      | 'territoryCode'
      | 'zoneCode'
      | 'city'
      | 'zip'
      | 'phoneNumber'
    >
  >;
  addresses: {
    edges: Array<{
      node: Pick<
        CustomerAccountAPI.CustomerAddress,
        | 'id'
        | 'formatted'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'territoryCode'
        | 'zoneCode'
        | 'city'
        | 'zip'
        | 'phoneNumber'
      >;
    }>;
  };
  orders: {
    edges: Array<{
      node: Pick<
        CustomerAccountAPI.Order,
        'id' | 'number' | 'processedAt' | 'financialStatus'
      > & {
        fulfillments: {
          nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>;
        };
        totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
        lineItems: {
          edges: Array<{
            node: Pick<CustomerAccountAPI.LineItem, 'title'> & {
              image?: CustomerAccountAPI.Maybe<
                Pick<
                  CustomerAccountAPI.Image,
                  'altText' | 'height' | 'url' | 'width'
                >
              >;
            };
          }>;
        };
      };
    }>;
  };
};

export type CustomerDetailsQueryVariables = CustomerAccountAPI.Exact<{
  [key: string]: never;
}>;

export type CustomerDetailsQuery = {
  customer: Pick<CustomerAccountAPI.Customer, 'firstName' | 'lastName'> & {
    phoneNumber?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerPhoneNumber, 'phoneNumber'>
    >;
    emailAddress?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerEmailAddress, 'emailAddress'>
    >;
    defaultAddress?: CustomerAccountAPI.Maybe<
      Pick<
        CustomerAccountAPI.CustomerAddress,
        | 'id'
        | 'formatted'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'territoryCode'
        | 'zoneCode'
        | 'city'
        | 'zip'
        | 'phoneNumber'
      >
    >;
    addresses: {
      edges: Array<{
        node: Pick<
          CustomerAccountAPI.CustomerAddress,
          | 'id'
          | 'formatted'
          | 'firstName'
          | 'lastName'
          | 'company'
          | 'address1'
          | 'address2'
          | 'territoryCode'
          | 'zoneCode'
          | 'city'
          | 'zip'
          | 'phoneNumber'
        >;
      }>;
    };
    orders: {
      edges: Array<{
        node: Pick<
          CustomerAccountAPI.Order,
          'id' | 'number' | 'processedAt' | 'financialStatus'
        > & {
          fulfillments: {
            nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>;
          };
          totalPrice: Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          lineItems: {
            edges: Array<{
              node: Pick<CustomerAccountAPI.LineItem, 'title'> & {
                image?: CustomerAccountAPI.Maybe<
                  Pick<
                    CustomerAccountAPI.Image,
                    'altText' | 'height' | 'url' | 'width'
                  >
                >;
              };
            }>;
          };
        };
      }>;
    };
  };
};

export type MoneyFragment = Pick<
  CustomerAccountAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type AddressFullFragment = Pick<
  CustomerAccountAPI.CustomerAddress,
  | 'address1'
  | 'address2'
  | 'city'
  | 'company'
  | 'country'
  | 'firstName'
  | 'formatted'
  | 'formattedArea'
  | 'id'
  | 'lastName'
  | 'name'
  | 'phoneNumber'
  | 'province'
  | 'territoryCode'
  | 'zip'
  | 'zoneCode'
>;

export type FulfillmentFragment = Pick<
  CustomerAccountAPI.Fulfillment,
  | 'createdAt'
  | 'estimatedDeliveryAt'
  | 'id'
  | 'isPickedUp'
  | 'latestShipmentStatus'
  | 'requiresShipping'
  | 'status'
  | 'updatedAt'
> & {
  events: {
    edges: Array<{
      node: Pick<
        CustomerAccountAPI.FulfillmentEvent,
        'happenedAt' | 'id' | 'status'
      >;
    }>;
  };
  fulfillmentLineItems: {
    edges: Array<{
      node: Pick<CustomerAccountAPI.FulfillmentLineItem, 'id' | 'quantity'> & {
        lineItem: Pick<CustomerAccountAPI.LineItem, 'title'> & {
          price?: CustomerAccountAPI.Maybe<
            Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        };
      };
    }>;
  };
};

export type CustomerOrderQueryVariables = CustomerAccountAPI.Exact<{
  orderId: CustomerAccountAPI.Scalars['ID']['input'];
}>;

export type CustomerOrderQuery = {
  order?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.Order,
      | 'cancelReason'
      | 'cancelledAt'
      | 'confirmationNumber'
      | 'createdAt'
      | 'currencyCode'
      | 'financialStatus'
      | 'locationName'
      | 'name'
      | 'note'
      | 'number'
      | 'poNumber'
      | 'processedAt'
      | 'requiresShipping'
      | 'statusPageUrl'
    > & {
      fulfillments: {
        edges: Array<{
          node: Pick<
            CustomerAccountAPI.Fulfillment,
            | 'createdAt'
            | 'estimatedDeliveryAt'
            | 'id'
            | 'isPickedUp'
            | 'latestShipmentStatus'
            | 'requiresShipping'
            | 'status'
            | 'updatedAt'
          > & {
            events: {
              edges: Array<{
                node: Pick<
                  CustomerAccountAPI.FulfillmentEvent,
                  'happenedAt' | 'id' | 'status'
                >;
              }>;
            };
            fulfillmentLineItems: {
              edges: Array<{
                node: Pick<
                  CustomerAccountAPI.FulfillmentLineItem,
                  'id' | 'quantity'
                > & {
                  lineItem: Pick<CustomerAccountAPI.LineItem, 'title'> & {
                    price?: CustomerAccountAPI.Maybe<
                      Pick<
                        CustomerAccountAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >
                    >;
                  };
                };
              }>;
            };
          };
        }>;
      };
      billingAddress?: CustomerAccountAPI.Maybe<
        Pick<
          CustomerAccountAPI.CustomerAddress,
          | 'address1'
          | 'address2'
          | 'city'
          | 'company'
          | 'country'
          | 'firstName'
          | 'formatted'
          | 'formattedArea'
          | 'id'
          | 'lastName'
          | 'name'
          | 'phoneNumber'
          | 'province'
          | 'territoryCode'
          | 'zip'
          | 'zoneCode'
        >
      >;
      paymentInformation?: CustomerAccountAPI.Maybe<{
        totalPaidAmount: Pick<
          CustomerAccountAPI.MoneyV2,
          'amount' | 'currencyCode'
        >;
      }>;
      refunds: Array<
        Pick<
          CustomerAccountAPI.Refund,
          'createdAt' | 'id' | 'returnName' | 'updatedAt'
        > & {
          totalRefunded: Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        }
      >;
      shippingAddress?: CustomerAccountAPI.Maybe<
        Pick<
          CustomerAccountAPI.CustomerAddress,
          | 'address1'
          | 'address2'
          | 'city'
          | 'company'
          | 'country'
          | 'firstName'
          | 'formatted'
          | 'formattedArea'
          | 'id'
          | 'lastName'
          | 'name'
          | 'phoneNumber'
          | 'province'
          | 'territoryCode'
          | 'zip'
          | 'zoneCode'
        >
      >;
      shippingDiscountAllocations: Array<{
        allocatedAmount: Pick<
          CustomerAccountAPI.MoneyV2,
          'amount' | 'currencyCode'
        >;
        discountApplication:
          | (Pick<
              CustomerAccountAPI.AutomaticDiscountApplication,
              'allocationMethod' | 'targetSelection' | 'targetType'
            > & {
              value: Pick<
                CustomerAccountAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            })
          | (Pick<
              CustomerAccountAPI.DiscountCodeApplication,
              'allocationMethod' | 'targetSelection' | 'targetType'
            > & {
              value: Pick<
                CustomerAccountAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            })
          | (Pick<
              CustomerAccountAPI.ManualDiscountApplication,
              'allocationMethod' | 'targetSelection' | 'targetType'
            > & {
              value: Pick<
                CustomerAccountAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            })
          | (Pick<
              CustomerAccountAPI.ScriptDiscountApplication,
              'allocationMethod' | 'targetSelection' | 'targetType'
            > & {
              value: Pick<
                CustomerAccountAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            });
      }>;
      shippingLine?: CustomerAccountAPI.Maybe<
        Pick<CustomerAccountAPI.ShippingLine, 'handle' | 'title'> & {
          originalPrice: Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        }
      >;
      subtotal?: CustomerAccountAPI.Maybe<
        Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      totalDuties?: CustomerAccountAPI.Maybe<
        Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
      totalRefunded: Pick<
        CustomerAccountAPI.MoneyV2,
        'amount' | 'currencyCode'
      >;
      totalShipping: Pick<
        CustomerAccountAPI.MoneyV2,
        'amount' | 'currencyCode'
      >;
      totalTax?: CustomerAccountAPI.Maybe<
        Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      totalTip?: CustomerAccountAPI.Maybe<
        Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
    }
  >;
};

interface GeneratedQueryTypes {
  '#graphql\n  query CustomerDetails {\n    customer {\n      ...CustomerDetails\n    }\n  }\n  #graphql\n  fragment OrderFragment on Order {\n    id\n    number\n    processedAt\n    financialStatus\n    fulfillments(first: 1) {\n      nodes {\n        status\n      }\n    }\n    totalPrice {\n      amount\n      currencyCode\n    }\n    lineItems(first: 2) {\n      edges {\n        node {\n          title\n          image {\n            altText\n            height\n            url\n            width\n          }\n        }\n      }\n    }\n  }\n\n  fragment AddressPartial on CustomerAddress {\n    id\n    formatted\n    firstName\n    lastName\n    company\n    address1\n    address2\n    territoryCode\n    zoneCode\n    city\n    zip\n    phoneNumber\n  }\n\n  fragment CustomerDetails on Customer {\n    firstName\n    lastName\n    phoneNumber {\n      phoneNumber\n    }\n    emailAddress {\n      emailAddress\n    }\n    defaultAddress {\n      ...AddressPartial\n    }\n    addresses(first: 6) {\n      edges {\n        node {\n          ...AddressPartial\n        }\n      }\n    }\n    orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {\n      edges {\n        node {\n          ...OrderFragment\n        }\n      }\n    }\n  }\n\n': {
    return: CustomerDetailsQuery;
    variables: CustomerDetailsQueryVariables;
  };
  '#graphql\n\n  fragment Money on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment AddressFull on CustomerAddress {\n  \taddress1\n    address2\n    city\n    company\n    country\n    firstName\n    formatted\n    formattedArea\n    id\n    lastName\n    name\n    phoneNumber\n    province\n    territoryCode\n    zip\n    zoneCode\n  }\n  \n  \n  fragment Fulfillment on Fulfillment{\n    createdAt\n    estimatedDeliveryAt\n    id\n    isPickedUp\n    latestShipmentStatus\n    requiresShipping\n    status\n    updatedAt\n    events(first : 100) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\thappenedAt\n\t\t\t\t\tid\n\t\t\t\t\tstatus\n\t\t\t\t}\n\t\t\t}\n    }\n    fulfillmentLineItems(first : 100) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tlineItem {\n\t\t\t\t\t\tprice {\n\t\t\t\t\t\t\t...Money\n\t\t\t\t\t\t}\n\t\t\t\t\t\ttitle\n\t\t\t\t\t}\n\t\t\t\t\tquantity\n\t\t\t\t}\n\t\t\t}\n    }\n  }\n  \n  \n\n  query CustomerOrder($orderId: ID!) {\n     \n    order(id: $orderId) {\n      ... on Order {\n        fulfillments(first : 100) {\n          edges {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\t...Fulfillment\n\t\t\t\t\t\t}\n        }\n        }\n        billingAddress {\n          ...AddressFull\n        }\n        cancelReason\n        cancelledAt\n        confirmationNumber\n        createdAt\n        currencyCode\n        financialStatus\n        locationName\n        name\n        note\n        number\n        paymentInformation {\n\t\t\t\t\ttotalPaidAmount {\n\t\t\t\t\t\t...Money\n\t\t\t\t\t}\n        }\n        poNumber\n        processedAt\n        refunds {\n\t\t\t\t\tcreatedAt\n\t\t\t\t\tid\n\t\t\t\t\treturnName\n\t\t\t\t\ttotalRefunded {\n\t\t\t\t\t\t\t...Money\n\t\t\t\t\t}\n\t\t\t\t\tupdatedAt\n        }\n        requiresShipping\n        shippingAddress {\n\t\t\t\t\t...AddressFull\n        }\n        shippingDiscountAllocations {\n\t\t\t\t\tallocatedAmount {\n\t\t\t\t\t\t\t...Money\n\t\t\t\t\t}\n            \n\t\t\t\t\tdiscountApplication {\n\t\t\t\t\t\tallocationMethod\n\t\t\t\t\t\ttargetSelection\n\t\t\t\t\t\ttargetType\n\t\t\t\t\t\tvalue {\n\t\t\t\t\t\t\t...Money\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n        }\n        shippingLine {\n\t\t\t\t\thandle\n\t\t\t\t\toriginalPrice {\n\t\t\t\t\t\t...Money\n\t\t\t\t\t}\n\t\t\t\t\ttitle\n        }\n        statusPageUrl\n        subtotal {\n          ...Money\n        }\n        totalDuties {\n          ...Money\n        }\n        totalPrice {\n          ...Money\n        }\n        totalRefunded {\n          ...Money\n        }\n        totalShipping {\n          ...Money\n        }\n        totalTax {\n          ...Money\n        }\n        totalTip {\n          ...Money\n        }\n\t\t\t}    \n    }\n\t}\n\n': {
    return: CustomerOrderQuery;
    variables: CustomerOrderQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface CustomerAccountQueries extends GeneratedQueryTypes {}
  interface CustomerAccountMutations extends GeneratedMutationTypes {}
}
