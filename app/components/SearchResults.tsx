import {Link} from '@remix-run/react';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';
import {motion} from 'motion/react';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      className="mb-16"
    >
      <h2 className="text-2xl font-bold mb-8 tracking-tight">Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles?.nodes?.map((article, index) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <motion.div
              key={article.id}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
            >
              <Link
                prefetch="intent"
                to={articleUrl}
                className="group block rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-black transition-colors">
                    {article.title}
                  </h3>
                  <div className="mt-4 h-0.5 w-0 bg-black group-hover:w-16 transition-all duration-300" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      className="mb-16"
    >
      <h2 className="text-2xl font-bold mb-8 tracking-tight">Pages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pages?.nodes?.map((page, index) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <motion.div
              key={page.id}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
            >
              <Link
                prefetch="intent"
                to={pageUrl}
                className="group block rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-black transition-colors">
                    {page.title}
                  </h3>
                  <div className="mt-4 h-0.5 w-0 bg-black group-hover:w-16 transition-all duration-300" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      className="mb-16"
    >
      <h2 className="text-2xl font-bold mb-8 tracking-tight">Products</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = nodes.map((product, index) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const image = product?.selectedOrFirstAvailableVariant?.image;

            return (
              <motion.div
                key={product.id}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.43, 0.13, 0.23, 0.96],
                }}
              >
                <Link prefetch="intent" to={productUrl} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                    {image && (
                      <Image
                        data={image}
                        alt={product.title}
                        aspectRatio="3/4"
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
                      {price && (
                        <Money
                          className="text-lg font-medium text-gray-900"
                          data={price}
                        />
                      )}
                      <div className="h-0.5 w-0 bg-black group-hover:w-16 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          });

          return (
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                {ItemsMarkup}
              </div>
              <div className="flex justify-center gap-4">
                <PreviousLink className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  {isLoading ? 'Loading...' : 'Previous'}
                </PreviousLink>
                <NextLink className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  {isLoading ? 'Loading...' : 'Next'}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
    </motion.div>
  );
}

function SearchResultsEmpty() {
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <p className="text-lg text-gray-600 mb-8">
        No results found. Please try a different search.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </motion.div>
  );
}
