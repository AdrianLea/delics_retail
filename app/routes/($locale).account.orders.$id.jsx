import invariant from 'tiny-invariant';
import clsx from 'clsx';
import {json, redirect} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {Money, Image, flattenConnection} from '@shopify/hydrogen';

import {CUSTOMER_ORDER_QUERY} from '../graphql/customer-account/CustomerOrderQuery';

import {statusMessage} from '~/lib/utils';
import {Link, Heading, PageHeader, Text} from '~/components';
import {CustomMoney} from '~/components/CustomMoney';

export const meta = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

export async function loader({request, context, params}) {
  if (!params.id) {
    return redirect(params?.locale ? `${params.locale}/account` : '/account');
  }

  const orderId = `gid://shopify/Order/${params.id}`;

  const res = await context.customerAccount.query(CUSTOMER_ORDER_QUERY, {
    variables: {orderId},
  });
  const order = res?.data?.order;

  if (!order) {
    throw new Response('Order not found', {status: 404});
  }

  const lineItems = flattenConnection(order.lineItems);

  const discountApplications = flattenConnection(order.discountApplications);

  const firstDiscount = discountApplications[0]?.value;

  const discountValue =
    firstDiscount?.__typename === 'MoneyV2' && firstDiscount;

  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue' &&
    firstDiscount?.percentage;

  return json({
    order,
    lineItems,
    discountValue,
    discountPercentage,
  });
}

export default function OrderRoute() {
  const {order, lineItems, discountValue, discountPercentage} = useLoaderData();
  return (
    <div>
      <PageHeader heading="Order detail">
        <Link to="/account">
          <Text color="subtle">Return to Account Overview</Text>
        </Link>
      </PageHeader>
      <div className="w-full p-6 sm:grid-cols-1 md:p-8 lg:p-12 lg:py-6">
        <div>
          <Text as="h3" size="lead">
            Order No. {order.name}
          </Text>
          <Text className="mt-2" as="p">
            Placed on {new Date(order.processedAt).toDateString()}
          </Text>
          <div className="grid items-start gap-12 sm:grid-cols-1 md:grid-cols-4 md:gap-16 sm:divide-y sm:divide-gray-200">
            <table className="min-w-full my-8 divide-y divide-gray-300 md:col-span-3">
              <thead>
                <tr className="align-baseline ">
                  <th
                    scope="col"
                    className="pb-4 pl-0 pr-3 font-semibold text-left"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="hidden px-4 pb-4 font-semibold text-right sm:table-cell md:table-cell"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="hidden px-4 pb-4 font-semibold text-right sm:table-cell md:table-cell"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-4 pb-4 font-semibold text-right"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lineItems.map((lineItem) => (
                  <tr key={lineItem.variant.id}>
                    <td className="w-full py-4 pl-0 pr-3 align-top sm:align-middle max-w-0 sm:w-auto sm:max-w-none">
                      <div className="flex gap-6">
                        <Link
                          to={`/products/${lineItem.variant.product.handle}`}
                        >
                          {lineItem?.variant?.image && (
                            <div className="w-24 card-image aspect-square">
                              <Image
                                data={lineItem.variant.image}
                                width={96}
                                height={96}
                              />
                            </div>
                          )}
                        </Link>
                        <div className="flex-col justify-center hidden lg:flex">
                          <Text as="p">{lineItem.title}</Text>
                          <Text size="fine" className="mt-1" as="p">
                            {lineItem.variant.title}
                          </Text>
                        </div>
                        <dl className="grid">
                          <dt className="sr-only">Product</dt>
                          <dd className="truncate lg:hidden">
                            <Heading size="copy" format as="h3">
                              {lineItem.title}
                            </Heading>
                            <Text size="fine" className="mt-1">
                              {lineItem.variant.title}
                            </Text>
                          </dd>
                          <dt className="sr-only">Price</dt>
                          <dd className="truncate sm:hidden">
                            <Text size="fine" className="mt-4">
                              <CustomMoney data={lineItem.variant.price} />
                            </Text>
                          </dd>
                          <dt className="sr-only">Quantity</dt>
                          <dd className="truncate sm:hidden">
                            <Text className="mt-1" size="fine">
                              Qty: {lineItem.quantity}
                            </Text>
                          </dd>
                        </dl>
                      </div>
                    </td>
                    <td className="hidden px-3 py-4 text-right align-top sm:align-middle sm:table-cell">
                      <CustomMoney data={lineItem.variant.price} />
                    </td>
                    <td className="hidden px-3 py-4 text-right align-top sm:align-middle sm:table-cell">
                      {lineItem.quantity}
                    </td>
                    <td className="px-3 py-4 text-right align-top sm:align-middle sm:table-cell">
                      <Text>
                        <CustomMoney data={lineItem.discountedTotalPrice} />
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {((discountValue && discountValue.amount) ||
                  discountPercentage) && (
                  <tr>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-6 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0"
                    >
                      <Text>Discounts</Text>
                    </th>
                    <th
                      scope="row"
                      className="pt-6 pr-3 font-normal text-left sm:hidden"
                    >
                      <Text>Discounts</Text>
                    </th>
                    <td className="pt-6 pl-3 pr-4 font-medium text-right text-green-700 md:pr-3">
                      {discountPercentage ? (
                        <span className="text-sm">
                          -{discountPercentage}% OFF
                        </span>
                      ) : (
                        discountValue && <CustomMoney data={discountValue} />
                      )}
                    </td>
                  </tr>
                )}
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-6 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0"
                  >
                    <Text>Subtotal</Text>
                  </th>
                  <th
                    scope="row"
                    className="pt-6 pr-3 font-normal text-left sm:hidden"
                  >
                    <Text>Subtotal</Text>
                  </th>
                  <td className="pt-6 pl-3 pr-4 text-right md:pr-3">
                    <CustomMoney data={order.subtotalPriceV2} />
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0"
                  >
                    Tax
                  </th>
                  <th
                    scope="row"
                    className="pt-4 pr-3 font-normal text-left sm:hidden"
                  >
                    <Text>Tax</Text>
                  </th>
                  <td className="pt-4 pl-3 pr-4 text-right md:pr-3">
                    <CustomMoney data={order.totalTaxV2} />
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 pl-6 pr-3 font-semibold text-right sm:table-cell md:pl-0"
                  >
                    Total
                  </th>
                  <th
                    scope="row"
                    className="pt-4 pr-3 font-semibold text-left sm:hidden"
                  >
                    <Text>Total</Text>
                  </th>
                  <td className="pt-4 pl-3 pr-4 font-semibold text-right md:pr-3">
                    <CustomMoney data={order.totalPriceV2} />
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className="sticky border-none top-nav md:my-8">
              <Heading size="copy" className="font-semibold" as="h3">
                Shipping Address
              </Heading>
              {order?.shippingAddress ? (
                <ul className="mt-6">
                  <li>
                    <Text>
                      {order.shippingAddress.firstName &&
                        order.shippingAddress.firstName + ' '}
                      {order.shippingAddress.lastName}
                    </Text>
                  </li>
                  {order?.shippingAddress?.formatted ? (
                    order.shippingAddress.formatted.map((line) => (
                      <li key={line}>
                        <Text>{line}</Text>
                      </li>
                    ))
                  ) : (
                    <></>
                  )}
                </ul>
              ) : (
                <p className="mt-3">No shipping address defined</p>
              )}
              <Heading size="copy" className="mt-8 font-semibold" as="h3">
                Status
              </Heading>
              <div
                className={clsx(
                  `mt-3 px-3 py-1 text-xs font-medium rounded-full inline-block w-auto`,
                  order.fulfillmentStatus === 'FULFILLED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-primary/20 text-primary/50',
                )}
              >
                <Text size="fine">
                  {statusMessage(order.fulfillmentStatus)}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
