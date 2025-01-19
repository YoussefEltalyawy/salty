import {Form, useLoaderData} from '@remix-run/react';
import {type LoaderFunctionArgs, json} from '@shopify/remix-oxygen';

export async function loader({context}: LoaderFunctionArgs) {
  const {data, errors} = await context.customerAccount.query<{
    customer: {firstName: string; lastName: string};
  }>(`#graphql
      query getCustomer {
        customer {
          firstName
          lastName
        }
      }
      `);

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return json(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Set-Cookie': await context.session.commit(),
      },
    },
  );
}

export default function () {
  const {customer} = useLoaderData<typeof loader>();

  return customer ? (
    <>
      <b>
        Welcome {customer.firstName} {customer.lastName}
      </b>
      <Form method="post" action="/logout">
        <button>Logout</button>
      </Form>
    </>
  ) : null;
}
