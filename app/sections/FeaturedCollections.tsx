import React from 'react';
import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {motion} from 'motion/react';
import type {FeaturedCollectionFragment} from 'storefrontapi.generated';

function FeaturedCollections({
  collections,
}: {
  collections: FeaturedCollectionFragment[];
}) {
  if (!collections?.length) return null;

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          viewport={{once: true}}
          className="text-4xl md:text-5xl font-bold text-black mb-16 font-poppins"
        >
          Our Collections
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: index * 0.1}}
              viewport={{once: true}}
            >
              <Link
                className="featured-collection group block"
                to={`/collections/${collection.handle}`}
              >
                {collection.image && (
                  <div className="featured-collection-image relative aspect-[4/5] overflow-hidden rounded-lg">
                    <Image
                      data={collection.image}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-lg font-light tracking-wider border border-white/60 py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Explore Collection
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <h3 className="text-xl font-medium text-black/90 group-hover:text-black transition-colors">
                    {collection.title}
                  </h3>
                  <div className="flex items-center text-black/70 group-hover:text-black transition-colors">
                    <span className="text-sm font-light tracking-wider italic">
                      View Products
                    </span>
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollections;
