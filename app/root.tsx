import {useNonce, getShopAnalytics, Analytics} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
  useRouteLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import {LOCK_PAGE_QUERY} from '~/graphql/lockQuery';
import {useState, useEffect} from 'react';
import {LockScreen} from '~/components/LockScreen';
import {safeLocalStorage} from '~/lib/utils';

import favicon from '~/assets/favicon.png';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import tailwindCss from './styles/tailwind.css?url';
import {PageLayout} from '~/components/PageLayout';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

// Define type for metafield
type Metafield = {
  key: string;
  value: string;
};

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  return defaultShouldRevalidate;
};

export function links() {
  return [
    {rel: 'stylesheet', href: tailwindCss},
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: appStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/png', href: favicon},
  ];
}

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return defer({
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: true,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  const [header, lockData] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheNone(),
      variables: {
        headerMenuHandle: 'main-menu',
      },
    }),
    storefront.query(LOCK_PAGE_QUERY, {
      cache: storefront.CacheNone(),
    }),
  ]);

  const metafields = lockData?.page?.metafields || [];
  const storeLockedMetafield = metafields.find(
    (m: Metafield) => m && m.key === 'store_locked',
  );
  // Only treat as locked if the store_locked metafield exists AND is set to 'true'
  const storeLocked = storeLockedMetafield?.value === 'true';

  // Get the password value if it exists
  const storePassword =
    metafields.find((m: Metafield) => m && m.key === 'store_password')?.value ||
    '';

  return {header, storeLocked, storePassword};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');
  // Add a loading state to prevent flash
  const [isChecking, setIsChecking] = useState(true);
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    // As soon as we have the data, we can check the status
    if (data) {
      // Only lock the website if store_locked is true AND store_password is defined and not empty
      const shouldLock =
        data.storeLocked === true &&
        typeof data.storePassword === 'string' &&
        data.storePassword.trim() !== '';

      // Check if the user has already entered the correct password when website should be locked
      const hasAccess =
        safeLocalStorage.getItem('storeAccessGranted') === 'true';

      if (hasAccess || !shouldLock) {
        setIsLocked(false);
      }

      // Only finish checking once we have the data
      setIsChecking(false);
    }
  }, [data]);

  const handlePasswordSuccess = () => {
    setIsLocked(false);
  };

  // Don't render anything until we've checked authentication status
  // This prevents the lock screen from flashing
  if (isChecking || !data) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <ScrollRestoration nonce={nonce} />
          <Scripts nonce={nonce} />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {data.storeLocked === true &&
        typeof data.storePassword === 'string' &&
        data.storePassword.trim() !== '' &&
        isLocked ? (
          <LockScreen
            correctPassword={data.storePassword}
            onPasswordSuccess={handlePasswordSuccess}
          />
        ) : (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <PageLayout {...data}>{children}</PageLayout>
          </Analytics.Provider>
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}
