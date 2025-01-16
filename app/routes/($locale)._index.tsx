import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense, useEffect, useRef} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {FlipWords} from '~/components/ui/flip-words';
import {
  motion,
  useScroll,
  useTransform,
  useAnimation,
  useInView,
} from 'motion/react';
import BrandStorySection from '~/components/BrandStory';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return defer({...deferredData, ...criticalData});
}

export async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  return {
    collections: collections.nodes,
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  const words = ['SALTY', 'ELEGANT', 'BOLD'];

  return (
    <>
      <section className="relative h-screen w-full font-poppins">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="hidden md:block absolute bottom-20 left-10 text-6xl font-bold text-white">
          <p className="inline mr-4">KEEP IT</p>
          <FlipWords words={words} /> <br />
        </div>

        <div className="md:hidden absolute bottom-20 left-10 text-6xl font-bold text-white">
          <p className="mb-0">KEEP IT</p>
          <FlipWords words={words} /> <br />
        </div>

        <div className="hidden md:inline-block absolute bottom-20 right-10">
          <div className="group flex text-lg items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer border border-[#BEB1A1] py-2 px-4 rounded-full">
            <Link
              to="#recommended-products"
              className="group flex text-lg items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <p className="font-light tracking-wider text-m italic">
                Discover more
              </p>
              <span className="transform transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
      <RecommendedProducts products={data.recommendedProducts} />
      <BrandStorySection />
      <FeaturedCollections collections={data.collections} />
    </>
  );
}

function FeaturedCollections({
  collections,
}: {
  collections: FeaturedCollectionFragment[];
}) {
  if (!collections?.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8 py-8">
      {collections.map((collection) => (
        <Link
          key={collection.id}
          className="featured-collection group"
          to={`/collections/${collection.handle}`}
        >
          {collection.image && (
            <div className="featured-collection-image relative aspect-[16/9] overflow-hidden rounded-lg">
              <Image
                data={collection.image}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          )}
          <div className="mt-4 space-y-2">
            <h2 className="text-lg font-medium text-black/90 group-hover:text-black transition-colors">
              {collection.title}
            </h2>
            <div className="h-0.5 w-0 bg-black group-hover:w-full transition-all duration-300" />
          </div>
        </Link>
      ))}
    </div>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.1,
    margin: '100px 0px 0px 0px',
  });
  const springControls = useAnimation();
  const scrollControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      springControls.start({
        x: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 50,
          damping: 20,
          duration: 0.8,
        },
      });

      setTimeout(() => {
        scrollControls.start({
          x: ['-0%', '-50%'],
          transition: {
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
          },
        });
      }, 1000);
    }
  }, [isInView, springControls, scrollControls]);

  return (
    <section id="recommended-products" className="bg-brandBeige">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden whitespace-nowrap"
      >
        <div className="inline-flex">
          <motion.div
            initial={{x: '50%', opacity: 0}}
            animate={springControls}
            className="flex whitespace-nowrap lg:-mt-20"
          >
            <motion.div
              animate={scrollControls}
              className="flex whitespace-nowrap"
            >
              <h2 className="text-black text-[100px] sm:text-[150px] md:text-[200px] lg:text-[400px] font-poppins uppercase shrink-0">
                Best Sellers&nbsp;
              </h2>
              <h2 className="text-black text-[100px] sm:text-[150px] md:text-[200px] lg:text-[400px] font-poppins uppercase shrink-0">
                Best Sellers&nbsp;
              </h2>
              <h2 className="text-black text-[100px] sm:text-[150px] md:text-[200px] lg:text-[400px] font-poppins uppercase shrink-0">
                Best Sellers&nbsp;
              </h2>
              <h2 className="text-black text-[100px] sm:text-[150px] md:text-[200px] lg:text-[400px] font-poppins uppercase shrink-0">
                Sellers Best&nbsp;
              </h2>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid px-4 sm:px-6 lg:px-8 font-poppins grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
              {response
                ? response.products.nodes.map((product) => (
                    <Link
                      key={product.id}
                      className="recommended-product group block"
                      to={`/products/${product.handle}`}
                    >
                      <div className="relative aspect-[9/16] overflow-hidden rounded-lg">
                        <Image
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          data={product.images.nodes[0]}
                          aspectRatio="9/16"
                          sizes="(min-width: 45em) 20vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <Money
                              className="text-white font-medium text-lg"
                              data={product.priceRange.minVariantPrice}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm sm:text-base lg:text-lg font-medium text-black/90 group-hover:text-black transition-colors">
                          {product.title}
                        </h4>
                        <div className="h-0.5 w-0 bg-black group-hover:w-full transition-all duration-300" />
                      </div>
                    </Link>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <div className="h-16" /> {/* Bottom spacing */}
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 10, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
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
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
