import React from 'react';
import {Facebook, Instagram, Twitter, Youtube} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brandBeige text-black font-poppins">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-black">SALTY.</h3>
            <p className="text-sm font-light">
              Merging timeless sophistication with contemporary streetwear for
              the discerning individual.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/salty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-black/70 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/salty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-black/70 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/salty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-black/70 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/salty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-black/70 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-black">Shop</h4>
            <ul className="space-y-2 text-sm font-light">
              <li>
                <a
                  href="/new-arrivals"
                  className="text-black hover:text-black/70 transition-colors"
                >
                  New Arrivals
                </a>
              </li>
              <li>
                <a
                  href="/best-sellers"
                  className="text-black hover:text-black/70 transition-colors"
                >
                  Best Sellers
                </a>
              </li>
              <li>
                <a
                  href="/collections"
                  className="text-black hover:text-black/70 transition-colors"
                >
                  Collections
                </a>
              </li>
              <li>
                <a
                  href="/sale"
                  className="text-black hover:text-black/70 transition-colors"
                >
                  Sale
                </a>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-black">Help</h4>
            <ul className="space-y-2 text-sm font-light">
              <li>
                <a
                  href="/contact"
                  className="text-black hover:text-black/70 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/shipping-returns"
                  className="text-black hover:text-black/70 transition-colors"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="/size-guide"
                  className="text-black hover:text-black/70 transition-colors"
                >
                  Size Guide
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-black hover:text-black/70 transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-black/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-xs text-black font-light">
              © {currentYear} SALTY. All rights reserved.
            </div>
            <div className="flex space-x-6 text-xs font-light">
              <a
                href="/privacy"
                className="text-black hover:text-black/70 transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
