import {flattenConnection, Image} from '@shopify/hydrogen';

import {Heading, Text, Link} from '~/components';
import {statusMessage} from '~/lib/utils';

export function OrderCard({order}) {
  if (!order?.id) return null;
  const orderIdParts = order.id.split('/');
  const orderId = orderIdParts[orderIdParts.length - 1];
  const lineItems = order?.lineItems?.edges;

  return (
    <li className="grid text-center border rounded">
      <div
        className="grid items-center gap-4 p-4 md:gap-6 md:p-6 md:grid-cols-2"
        // to={`/account/orders/${orderId}`}
        // prefetch="intent"
      >
        {lineItems[0].node?.image && (
          <div className="card-image aspect-square bg-primary/5">
            <Image
              width={168}
              height={168}
              className="w-full fadeIn cover"
              alt={lineItems[0].node?.image?.altText ?? 'Order image'}
              src={lineItems[0].node?.image?.url}
            />
          </div>
        )}
        <div
          className={`flex-col justify-center text-left ${
            !lineItems[0].node?.image && 'md:col-span-2'
          }`}
        >
          <Heading as="h3" format size="copy">
            {lineItems.length > 1
              ? `${lineItems[0].node?.title} +${lineItems.length - 1} more`
              : lineItems[0].node?.title}
          </Heading>
          <dl className="grid grid-gap-1">
            <dt className="sr-only">Order ID</dt>
            <dd>
              <Text size="fine" color="subtle">
                Order No. {order?.number}
              </Text>
            </dd>
            <dt className="sr-only">Order Date</dt>
            <dd>
              <Text size="fine" color="subtle">
                {new Date(order?.processedAt).toDateString()}
              </Text>
            </dd>
            <dt className="sr-only">Fulfillment Status</dt>
            <dd className="mt-2 w-full flex-row">
              {order.fulfillments.nodes.map((node) => (
                <span
                  key={node?.id}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    node?.status === 'SUCCESS'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-primary/5 text-primary/50'
                  }`}
                >
                  <Text size="fine">{statusMessage(node.status)}</Text>
                </span>
              ))}
            </dd>
          </dl>
        </div>
      </div>
      {/* <div className="self-end border-t">
        <Link
          className="block w-full p-2 text-center"
          to={`/account/orders/${orderId}`}
          prefetch="intent"
        >
          <Text color="subtle" className="ml-3">
            View Details
          </Text>
        </Link>
      </div> */}
    </li>
  );
}
