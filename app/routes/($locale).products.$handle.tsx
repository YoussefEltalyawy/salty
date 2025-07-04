import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from '@remix-run/react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import ProductImage from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {Suspense} from 'react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Salty | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Load all data in parallel
  const [criticalData, deferredData] = await Promise.all([
    loadCriticalData(args),
    loadDeferredData(args),
  ]);

  return {
    ...criticalData,
    ...deferredData,
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const selectedOptions = getSelectedProductOptions(request);
  try {
    const {product} = await storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    });

    if (!product?.id) {
      throw new Response(null, {status: 404});
    }

    // Get recommended products for the product page
    const {productRecommendations} = await storefront.query(
      RECOMMENDED_PRODUCTS_QUERY,
      {
        variables: {
          productId: product.id,
          country: context.storefront.i18n.country,
          language: context.storefront.i18n.language,
        },
      },
    );

    return {
      product,
      recommendedProducts: productRecommendations,
      selectedVariant: product.selectedOrFirstAvailableVariant,
    };
  } catch (error) {
    console.error('Error loading product:', error);
    throw error;
  }
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
async function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // This function can be used to load any non-critical data
  // that can be loaded after the initial page render
  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  return (
    <div key={product.id} className="py-16 font-poppins">
      <div className="mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-16">
          {/* Left Side - Image */}
          <div className="space-y-8">
            <ProductImage
              images={product.images.nodes.map((node) => ({
                id: node.id,
                url: node.url,
                altText: node.altText,
                width: node.width,
                height: node.height,
              }))}
              selectedVariantImage={selectedVariant?.image}
            />
          </div>

          {/* Right Side - Detials */}
          <div className="space-y-10">
            {/* Product Title & Price */}
            <div className="space-y-4 pb-0">
              <h1 className="text-2xl font-semibold md:text-4xl lg:text-5xl text-black/90">
                {product.title}
              </h1>
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant.compareAtPrice}
                className="text-black/80"
              />
            </div>

            {/* Product Form */}
            <div className="border-t border-gray-200 pt-6">
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
                productHandle={product.handle}
              />
            </div>

            {/* Product Description */}
            {descriptionHtml && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Product Details
                </h2>
                <div
                  className="prose max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{__html: descriptionHtml}}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url(transform: {maxWidth: 1200, maxHeight: 1200, crop: CENTER})
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    quantityAvailable
    sellingPlanAllocations(first: 10) {
      edges {
        node {
          priceAdjustments {
            compareAtPrice {
              amount
              currencyCode
            }
            price {
              amount
              currencyCode
            }
            unitPrice {
              amount
              currencyCode
            }
          }
          sellingPlan {
            id
            name
            description
            options {
              name
              value
            }
            priceAdjustments {
              orderCount
              adjustmentValue {
                ... on SellingPlanFixedAmountPriceAdjustment {
                  adjustmentAmount {
                    amount
                    currencyCode
                  }
                }
                ... on SellingPlanFixedPriceAdjustment {
                  price {
                    amount
                    currencyCode
                  }
                }
                ... on SellingPlanPercentagePriceAdjustment {
                  adjustmentPercentage
                }
              }
            }
          }
        }
      }
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
    $intent: ProductRecommendationIntent = RELATED
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId, intent: $intent) {
      id
      title
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 1) {
        nodes {
          url(transform: {maxWidth: 300, maxHeight: 300, crop: CENTER})
          altText
          width
          height
        }
      }
    }
  }
` as const;
