import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {motion} from 'motion/react';

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: 'Salty | All Products'}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
  ]);
  return {products};
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Products() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white font-poppins">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            All Products
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover our latest collection of premium fashion pieces
          </p>
        </motion.div>

        <PaginatedResourceSection
          connection={products}
          resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
        >
          {({node: product, index}) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 8 ? 'eager' : undefined}
              index={index}
            />
          )}
        </PaginatedResourceSection>
      </div>
    </div>
  );
}

function ProductItem({
  product,
  loading,
  index,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
  index: number;
}) {
  const variantUrl = useVariantUrl(product.handle);

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.43, 0.13, 0.23, 0.96],
      }}
    >
      <Link className="group block" prefetch="intent" to={variantUrl}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
          {product.featuredImage && (
            <Image
              alt={product.featuredImage.altText || product.title}
              aspectRatio="3/4"
              data={product.featuredImage}
              loading={loading}
              sizes="(min-width: 1540px) 420px, (min-width: 1280px) 33vw, (min-width: 1024px) 50vw, 100vw"
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>

        <div className="mt-6 space-y-1">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-black transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <Money
              className="text-lg font-medium text-gray-900"
              data={product.priceRange.minVariantPrice}
            />
            <div className="h-0.5 w-0 bg-black group-hover:w-16 transition-all duration-300" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
