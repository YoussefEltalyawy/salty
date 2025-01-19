import {Link, useFetcher, type Fetcher} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import React, {useRef, useEffect} from 'react';
import {motion} from 'motion/react';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
  type PredictiveSearchReturn,
} from '~/lib/search';
import {useAside} from './Aside';

type PredictiveSearchItems = PredictiveSearchReturn['result']['items'];

type UsePredictiveSearchReturn = {
  term: React.MutableRefObject<string>;
  total: number;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  items: PredictiveSearchItems;
  fetcher: Fetcher<PredictiveSearchReturn>;
};

type SearchResultsPredictiveArgs = Pick<
  UsePredictiveSearchReturn,
  'term' | 'total' | 'inputRef' | 'items'
> & {
  state: Fetcher['state'];
  closeSearch: () => void;
};

type PartialPredictiveSearchResult<
  ItemType extends keyof PredictiveSearchItems,
  ExtraProps extends keyof SearchResultsPredictiveArgs = 'term' | 'closeSearch',
> = Pick<PredictiveSearchItems, ItemType> &
  Pick<SearchResultsPredictiveArgs, ExtraProps>;

type SearchResultsPredictiveProps = {
  children: (args: SearchResultsPredictiveArgs) => React.ReactNode;
};

/**
 * Component that renders predictive search results
 */
export function SearchResultsPredictive({
  children,
}: SearchResultsPredictiveProps) {
  const aside = useAside();
  const {term, inputRef, fetcher, total, items} = usePredictiveSearch();

  function resetInput() {
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.value = '';
    }
  }

  function closeSearch() {
    resetInput();
    aside.close();
  }

  return children({
    items,
    closeSearch,
    inputRef,
    state: fetcher.state,
    term,
    total,
  });
}

SearchResultsPredictive.Articles = SearchResultsPredictiveArticles;
SearchResultsPredictive.Collections = SearchResultsPredictiveCollections;
SearchResultsPredictive.Pages = SearchResultsPredictivePages;
SearchResultsPredictive.Products = SearchResultsPredictiveProducts;
SearchResultsPredictive.Queries = SearchResultsPredictiveQueries;
SearchResultsPredictive.Empty = SearchResultsPredictiveEmpty;

function SearchResultsPredictiveArticles({
  term,
  articles,
  closeSearch,
}: PartialPredictiveSearchResult<'articles'>) {
  if (!articles.length) return null;

  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      className="py-4"
    >
      <h5 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Articles
      </h5>
      <ul className="space-y-2">
        {articles.map((article, index) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.blog.handle}/${article.handle}`,
            trackingParams: article.trackingParameters,
            term: term.current ?? '',
          });

          return (
            <motion.li
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: index * 0.1}}
              key={article.id}
              className="group"
            >
              <Link
                onClick={closeSearch}
                to={articleUrl}
                className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                {article.image?.url && (
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      alt={article.image.altText ?? ''}
                      src={article.image.url}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="ml-4">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-black">
                    {article.title}
                  </span>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}

function SearchResultsPredictiveCollections({
  term,
  collections,
  closeSearch,
}: PartialPredictiveSearchResult<'collections'>) {
  if (!collections.length) return null;

  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      className="py-4"
    >
      <h5 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Collections
      </h5>
      <ul className="space-y-2">
        {collections.map((collection, index) => {
          const collectionUrl = urlWithTrackingParams({
            baseUrl: `/collections/${collection.handle}`,
            trackingParams: collection.trackingParameters,
            term: term.current,
          });

          return (
            <motion.li
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: index * 0.1}}
              key={collection.id}
              className="group"
            >
              <Link
                onClick={closeSearch}
                to={collectionUrl}
                className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                {collection.image?.url && (
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      alt={collection.image.altText ?? ''}
                      src={collection.image.url}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="ml-4">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-black">
                    {collection.title}
                  </span>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}

function SearchResultsPredictivePages({
  term,
  pages,
  closeSearch,
}: PartialPredictiveSearchResult<'pages'>) {
  if (!pages.length) return null;

  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      className="py-4"
    >
      <h5 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Pages
      </h5>
      <ul className="space-y-2">
        {pages.map((page, index) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term: term.current,
          });

          return (
            <motion.li
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: index * 0.1}}
              key={page.id}
              className="group"
            >
              <Link
                onClick={closeSearch}
                to={pageUrl}
                className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <div className="ml-4">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-black">
                    {page.title}
                  </span>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}

function SearchResultsPredictiveProducts({
  term,
  products,
  closeSearch,
}: PartialPredictiveSearchResult<'products'>) {
  if (!products.length) return null;

  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      className="py-4"
    >
      <h5 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Products
      </h5>
      <ul className="space-y-2">
        {products.map((product, index) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });

          const price = product?.selectedOrFirstAvailableVariant?.price;
          const image = product?.selectedOrFirstAvailableVariant?.image;

          return (
            <motion.li
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: index * 0.1}}
              key={product.id}
              className="group"
            >
              <Link
                to={productUrl}
                onClick={closeSearch}
                className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                {image && (
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      alt={image.altText ?? ''}
                      src={image.url}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="ml-4 flex-grow">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-black">
                    {product.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {price && <Money data={price} />}
                  </p>
                </div>
                <div className="h-0.5 w-0 bg-black group-hover:w-8 transition-all duration-300" />
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}

function SearchResultsPredictiveQueries({
  queries,
  queriesDatalistId,
}: PartialPredictiveSearchResult<'queries', never> & {
  queriesDatalistId: string;
}) {
  if (!queries.length) return null;

  return (
    <datalist id={queriesDatalistId}>
      {queries.map((suggestion) => {
        if (!suggestion) return null;

        return <option key={suggestion.text} value={suggestion.text} />;
      })}
    </datalist>
  );
}

function SearchResultsPredictiveEmpty({
  term,
}: {
  term: React.MutableRefObject<string>;
}) {
  if (!term.current) {
    return null;
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      className="p-4 text-center"
    >
      <p className="text-sm text-gray-500">
        No results found for{' '}
        <span className="font-medium">&quot;{term.current}&quot;</span>
      </p>
    </motion.div>
  );
}

/**
 * Hook that returns the predictive search results and fetcher and input ref.
 * @example
 * '''ts
 * const { items, total, inputRef, term, fetcher } = usePredictiveSearch();
 * '''
 **/
function usePredictiveSearch(): UsePredictiveSearchReturn {
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});
  const term = useRef<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (fetcher?.state === 'loading') {
    term.current = String(fetcher.formData?.get('q') || '');
  }

  // capture the search input element as a ref
  useEffect(() => {
    if (!inputRef.current) {
      inputRef.current = document.querySelector('input[type="search"]');
    }
  }, []);

  const {items, total} =
    fetcher?.data?.result ?? getEmptyPredictiveSearchResult();

  return {items, total, inputRef, term, fetcher};
}
