import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense, useEffect, useRef, useState} from 'react';
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
import FeaturedCollections from '~/sections/FeaturedCollections';
import ShopTheFit from '~/sections/ShopTheFit';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import {MoveRight} from 'lucide-react';

export const meta: MetaFunction = () => {
  return [{title: 'Salty | Home'}];
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

export async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  return {
    collections: collections.nodes,
  };
}

async function loadDeferredData({context}: LoaderFunctionArgs) {
  try {
    const recommendedProducts = await context.storefront.query(
      RECOMMENDED_PRODUCTS_QUERY,
    );
    return {recommendedProducts};
  } catch (error) {
    console.error('Failed to load recommended products', error);
    return {recommendedProducts: null};
  }
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  const words = ['SALTY', 'ELEGANT', 'BOLD'];
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <>
      <section className="relative h-screen w-full font-poppins">
        {/* Placeholder image */}
        <div
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
            isVideoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            backgroundImage: "url('/placeholder-hero.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
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

        <div className="absolute bottom-20 right-10">
          <Link
            to="/collections/s25-collection"
            className="flex items-center gap-2 transition-colors cursor-pointer"
          >
            {/* Desktop view: Show text and border */}
            <div className="hidden md:flex items-center gap-2 border border-[#BEB1A1] py-2 px-4 rounded-full text-white/70 hover:text-white transition-colors">
              <p className="font-light tracking-wider text-m italic">
                Discover more
              </p>
              <span className="transform transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
            {/* Mobile view: Show circular button */}
            <div className="flex md:hidden w-10 h-10 bg-brandBeige rounded-full items-center justify-center text-[#BEB1A1] hover:text-white transition-colors">
              <span className="text-black/70">
                <MoveRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>
      <RecommendedProducts products={data.recommendedProducts} />
      <FeaturedCollections collections={data.collections} />
      <ShopTheFit />

      {/* FAQ Section */}
      <section className="w-full bg-brandBeige py-16">
        <div className="mx-1 px-4">
          <h2 className="text-4xl md:text-7xl lg:text-9xl font-bold mx-auto text-black mb-4">
            FAQ
          </h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                How long does shipping take in Egypt?
              </AccordionTrigger>
              <AccordionContent>
                Shipping takes 2-5 days from the date of purchase. In rare
                cases, shipping may take longer due to unusual conditions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                Can I return / exchange items purchased online?
              </AccordionTrigger>
              <AccordionContent>
                Yes, returns and exchanges are available for online purchases
                under these conditions:
                {'\n\n'}• The request is made within 14 days of purchase.
                {'\n'}• Items are in their original condition (unwashed,
                unaltered, spotless) with all tags intact.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                How do I request a return or exchange?
              </AccordionTrigger>
              <AccordionContent>
                Submit your request with proof of purchase or the order number.
                You will receive an email shortly with the status of your
                request.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                Can I exchange an item for a different size?
              </AccordionTrigger>
              <AccordionContent>
                Yes, you can exchange your item for a different size, provided
                the requested size is in stock.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>
                Can I cancel my order after placing it?
              </AccordionTrigger>
              <AccordionContent>
                Yes, but you need to contact us immediately. Once an order is
                dispatched, it cannot be canceled or changed.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
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
            className="flex whitespace-nowrap lg:-mt-20"
          >
            <motion.div
              animate={scrollControls}
              className="flex whitespace-nowrap"
            >
              <h2 className="text-black text-[100px] sm:text-[150px] md:text-[200px] lg:text-[400px] font-poppins font-semibold uppercase shrink-0">
                Best Sellers&nbsp;
              </h2>
              <h2 className="text-black text-[100px] sm:text-[150px] md:text-[200px] lg:text-[400px] font-poppins font-semibold uppercase shrink-0">
                Best Sellers&nbsp;
              </h2>
              <h2 className="text-black text-[100px] sm:text-[150px] md:text-[200px] lg:text-[400px] font-poppins font-semibold uppercase shrink-0">
                Best Sellers&nbsp;
              </h2>
              <h2 className="text-black text-[100px] sm:text-[150px] md:text-[200px] lg:text-[400px] font-poppins font-semibold uppercase shrink-0">
                Sellers Best&nbsp;
              </h2>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid px-4 sm:px-6 lg:px-8 font-poppins grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
              {response
                ? response.products.nodes.map((product) => (
                    <Link
                      key={product.id}
                      className="recommended-product group block"
                      prefetch="intent"
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
    products(first: 6, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
