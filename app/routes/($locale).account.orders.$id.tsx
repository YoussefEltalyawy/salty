import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Money, Image, flattenConnection} from '@shopify/hydrogen';
import type {OrderLineItemFullFragment} from 'customer-accountapi.generated';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';
import {motion} from 'motion/react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_ORDER_QUERY,
    {
      variables: {orderId},
    },
  );

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  const {order} = data;

  const lineItems = flattenConnection(order.lineItems);
  const discountApplications = flattenConnection(order.discountApplications);

  const fulfillmentStatus =
    flattenConnection(order.fulfillments)[0]?.status ?? 'N/A';

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
    fulfillmentStatus,
  });
}

export default function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData<typeof loader>();

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      className="bg-white shadow-sm rounded-lg overflow-hidden"
    >
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900">
          Order {order.name}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Placed on {new Date(order.processedAt!).toLocaleDateString()}
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {fulfillmentStatus}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Shipping Address
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {order?.shippingAddress ? (
                <address className="not-italic">
                  <p>{order.shippingAddress.name}</p>
                  {order.shippingAddress.formatted ? (
                    <p>{order.shippingAddress.formatted}</p>
                  ) : (
                    ''
                  )}
                  {order.shippingAddress.formattedArea ? (
                    <p>{order.shippingAddress.formattedArea}</p>
                  ) : (
                    ''
                  )}
                </address>
              ) : (
                <p>No shipping address defined</p>
              )}
            </dd>
          </div>
        </dl>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Product
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Quantity
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lineItems.map((lineItem, index) => (
            <OrderLineRow key={lineItem.id} lineItem={lineItem} />
          ))}
        </tbody>
        <tfoot>
          {((discountValue && discountValue.amount) || discountPercentage) && (
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="px-6 py-3 text-left text-sm font-medium text-gray-500"
              >
                Discounts
              </th>
              <td className="px-6 py-3 text-left text-sm text-gray-500">
                {discountPercentage ? (
                  <span>-{discountPercentage}% OFF</span>
                ) : (
                  discountValue && <Money data={discountValue!} />
                )}
              </td>
            </tr>
          )}
          <tr>
            <th
              scope="row"
              colSpan={3}
              className="px-6 py-3 text-left text-sm font-medium text-gray-500"
            >
              Subtotal
            </th>
            <td className="px-6 py-3 text-left text-sm text-gray-500">
              <Money data={order.subtotal!} />
            </td>
          </tr>
          <tr>
            <th
              scope="row"
              colSpan={3}
              className="px-6 py-3 text-left text-sm font-medium text-gray-500"
            >
              Tax
            </th>
            <td className="px-6 py-3 text-left text-sm text-gray-500">
              <Money data={order.totalTax!} />
            </td>
          </tr>
          <tr>
            <th
              scope="row"
              colSpan={3}
              className="px-6 py-3 text-left text-sm font-medium text-gray-900"
            >
              Total
            </th>
            <td className="px-6 py-3 text-left text-sm font-medium text-gray-900">
              <Money data={order.totalPrice!} />
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="px-4 py-5 sm:px-6">
        <a
          target="_blank"
          href={order.statusPageUrl}
          rel="noreferrer"
          className="text-indigo-600 hover:text-indigo-900"
        >
          View Order Status →
        </a>
      </div>
    </motion.div>
  );
}

function OrderLineRow({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {lineItem?.image && (
            <div className="flex-shrink-0 h-10 w-10 mr-4">
              <Image
                data={lineItem.image}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">
              {lineItem.title}
            </div>
            <div className="text-sm text-gray-500">{lineItem.variantTitle}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <Money data={lineItem.price!} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {lineItem.quantity}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <Money data={lineItem.totalDiscount!} />
      </td>
    </tr>
  );
}
