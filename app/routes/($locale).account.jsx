import {
  Form,
  Outlet,
  useLoaderData,
  useMatches,
  useOutlet,
} from '@remix-run/react';
import {defer, redirect} from '@shopify/remix-oxygen';

import {CUSTOMER_DETAILS_QUERY} from '../graphql/customer-account/CustomerDetailsQuery';

import {getFeaturedData} from './($locale).featured-products';

import {
  Button,
  OrderCard,
  PageHeader,
  Text,
  AccountDetails,
  AccountAddressBook,
  Modal,
} from '~/components';
import {usePrefixPathWithLocale} from '~/lib/utils';
import {routeHeaders} from '~/data/cache';
export const headers = routeHeaders;

export async function loader({request, context, params}) {
  const customer = await getCustomer(context);

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}.`
      : `Welcome to your account.`
    : 'Account Details';

  return defer(
    {
      customer,
      heading,
    },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function Authenticated() {
  const data = useLoaderData();
  const outlet = useOutlet();
  const matches = useMatches();

  // routes that export handle { renderInModal: true }
  const renderOutletInModal = matches.some((match) => {
    return match?.handle?.renderInModal;
  });

  // Public routes

  // Authenticated routes
  if (outlet) {
    if (renderOutletInModal) {
      return (
        <>
          <Modal cancelLink="/account">
            <Outlet context={{customer: data.customer}} />
          </Modal>
          <Account {...data} />
        </>
      );
    } else {
      return <Outlet context={{customer: data.customer}} />;
    }
  }

  return <Account {...data} />;
}

function Account({customer, heading, featuredData}) {
  const orders = customer.orders.edges;
  const addresses = customer.addresses.edges;

  return (
    <>
      <PageHeader heading={heading}>
        <Form method="post" action={usePrefixPathWithLocale('/account/logout')}>
          <button
            type="submit"
            className="text-black border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50"
          >
            Sign out
          </button>
        </Form>
      </PageHeader>
      {orders && <AccountOrderHistory orders={orders} />}
      <AccountDetails customer={customer} />
      <AccountAddressBook addresses={addresses} customer={customer} />
    </>
  );
}

function AccountOrderHistory({orders}) {
  return (
    <div className="mt-6">
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h2 className="font-bold text-lead">Order History</h2>
        {orders?.length ? <Orders orders={orders} /> : <EmptyOrders />}
      </div>
    </div>
  );
}

function EmptyOrders() {
  return (
    <div>
      <Text className="mb-1" size="fine" width="narrow" as="p">
        You haven&apos;t placed any orders yet.
      </Text>
      <div className="w-48">
        <Button
          className="w-full mt-2 text-sm"
          variant="secondary"
          to={usePrefixPathWithLocale('/')}
        >
          Start Shopping
        </Button>
      </div>
    </div>
  );
}

function Orders({orders}) {
  return (
    <ul className="grid grid-flow-row grid-cols-1 gap-2 gap-y-6 md:gap-4 lg:gap-6 false sm:grid-cols-3">
      {orders.map(({node}) => (
        <OrderCard order={node} key={node.id} />
      ))}
    </ul>
  );
}

export async function getCustomer(context) {
  const {storefront} = context;

  const data = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    cache: storefront.CacheNone(),
  });

  /**
   * If the customer failed to load, we assume their access token is invalid.
   */
  if (!data || !data.data.customer) {
    redirect('account/login');
  }

  return data.data.customer;
}
