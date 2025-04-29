import {defer, type LoaderFunctionArgs, redirect} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';

interface PageData {
  id: string;
  title: string;
  body: string;
  seo: {
    description: string;
    title: string;
  };
}

interface LoaderData {
  page: PageData;
  // Add other deferred data types here
}

/**
 * Meta tags configuration for the page
 */
export const meta: MetaFunction<typeof loader> = ({data}) => [
  {title: `Salty | ${data?.page.title ?? ''}`},
  {description: data?.page.seo.description ?? ''},
];

/**
 * Main loader function that combines critical and deferred data
 * @param args - Loader function arguments from Remix
 */
export async function loader(args: LoaderFunctionArgs) {
  const {params} = args;

  // Redirect to home page if handle is "lock-with-password"
  if (params.handle === 'lock-with-password') {
    return redirect('/');
  }

  const [criticalData, deferredData] = await Promise.all([
    loadCriticalData(args),
    loadDeferredData(args),
  ]);

  return defer({
    ...criticalData,
    ...deferredData,
  });
}

/**
 * Loads critical data required for initial page render
 * @throws {Response} 404 if page not found
 * @throws {Error} if handle parameter is missing
 */
async function loadCriticalData({context, params}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const {page} = await context.storefront.query<{page: PageData}>(PAGE_QUERY, {
    variables: {
      handle: params.handle,
    },
  });

  if (!page) {
    throw new Response('Page not found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  return {page};
}

/**
 * Loads non-critical data that can be deferred
 * This function should never throw errors to prevent page crashes
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {
    // Add deferred data properties here
  };
}

/**
 * Page component that renders the content
 */
export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div className=" mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {page.title}
        </h1>
      </header>

      <main
        className="prose prose-lg prose-indigo max-w-none mb-[25.5rem] lg:mb-[34rem]"
        dangerouslySetInnerHTML={{__html: page.body}}
      />
    </div>
  );
}

/**
 * GraphQL query for fetching page data
 */
const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  ) @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
