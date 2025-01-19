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
  const collectionsWithImages = collections?.filter(
    (collection) => collection.image,
  );

  if (!collectionsWithImages?.length) return null;

  return (
    <section className="bg-black py-12 font-poppins">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          viewport={{once: true}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-7xl lg:text-9xl font-bold mx-auto  text-brandBeige mb-4">
            SHOP BY COLLECTION
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {collectionsWithImages.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: index * 0.1}}
              viewport={{once: true}}
              className="relative aspect-[3/4] overflow-hidden"
            >
              <Link
                className="group block w-full h-full"
                to={`/collections/${collection.handle}`}
              >
                {collection.image && (
                  <>
                    <Image
                      data={collection.image}
                      sizes="(min-width: 1800px) 25vw, (min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                      <h3 className="text-2xl sm:text-3xl font-bold mb-2 uppercase tracking-wider">
                        {collection.title.split(' ')[0]}
                      </h3>
                      <h4 className="text-xl sm:text-2xl font-bold mb-4 uppercase tracking-wider">
                        {collection.title.split(' ').slice(1).join(' ')}
                      </h4>
                      <span className="inline-flex items-center justify-center px-6 py-2 border-2 border-white text-sm font-semibold hover:bg-white hover:text-black transition-colors duration-300">
                        SHOP NOW
                      </span>
                    </div>
                  </>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollections;
