import React from 'react';
import {motion} from 'motion/react';
import {Link} from '@remix-run/react';
import {ArrowUpRight} from 'lucide-react';

const BrandStorySection = () => {
  return (
    <section className="relative bg-black text-brandBeige py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
            viewport={{once: true}}
            className="space-y-8"
          >
            <h2 className="text-6xl font-bold">Our Story</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              At Salty, we craft a distinctive fashion narrative that
              harmoniously merges the timeless sophistication of old-money style
              with the boldness of contemporary streetwear. Our curated
              collections cater to discerning individuals who embrace a refined
              aesthetic infused with modern attitude. Discover a seamless blend
              of classic elegance and urban edge, designed to empower your
              personal style.
            </p>
            <Link
              to="/about-us"
              className="inline-flex items-center gap-2 text-lg font-medium hover:gap-4 transition-all group"
            >
              Learn More{' '}
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:rotate-45" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.8, delay: 0.2}}
              viewport={{once: true}}
              className="space-y-4"
            ></motion.div>
            <motion.div
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.8, delay: 0.4}}
              viewport={{once: true}}
              className="pt-8"
            ></motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStorySection;
