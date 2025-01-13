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

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  return {
    featuredCollection: collections.nodes[0],
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
    </>
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
            className="flex whitespace-nowrap -mt-12 sm:-mt-20 md:-mt-24 lg:-mt-36"
          >
            <motion.div
              animate={scrollControls}
              className="flex whitespace-nowrap"
            >
              <h2 className="text-black text-[200px] sm:text-[300px] md:text-[400px] lg:text-[600px] font-poppins uppercase shrink-0">
                Best Sellers&nbsp;
              </h2>
              <h2 className="text-black text-[200px] sm:text-[300px] md:text-[400px] lg:text-[600px] font-poppins uppercase shrink-0">
                Best Sellers&nbsp;
              </h2>
              <h2 className="text-black text-[200px] sm:text-[300px] md:text-[400px] lg:text-[600px] font-poppins uppercase shrink-0">
                Best Sellers&nbsp;
              </h2>
              <h2 className="text-black text-[200px] sm:text-[300px] md:text-[400px] lg:text-[600px] font-poppins uppercase shrink-0">
                Sellers Best&nbsp;
              </h2>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid px-4 sm:px-6 lg:px-8">
              {response
                ? response.products.nodes.map((product) => (
                    <Link
                      key={product.id}
                      className="recommended-product"
                      to={`/products/${product.handle}`}
                    >
                      <Image
                        data={product.images.nodes[0]}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                      />
                      <h4 className="text-sm sm:text-base lg:text-lg">
                        {product.title}
                      </h4>
                      <small className="text-xs sm:text-sm">
                        <Money data={product.priceRange.minVariantPrice} />
                      </small>
                    </Link>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
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
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
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
