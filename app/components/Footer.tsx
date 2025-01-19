import React from 'react';
import {Facebook, Instagram, Twitter} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-brandBeige font-poppins border-t border-brandBeige/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-row justify-between items-center">
          <div className="text-sm">© {currentYear} SALTY.</div>

          <div className="flex items-center gap-2">
            <div className="flex md:gap-4">
              <a
                href="https://facebook.com/salty.cai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brandBeige hover:text-brandBeige/70 transition-colors p-2 sm:p-0"
              >
                <Facebook className="w-5 h-5 sm:w-4 sm:h-4" />
              </a>
              <a
                href="https://instagram.com/salty.cai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brandBeige hover:text-brandBeige/70 transition-colors p-2 sm:p-0"
              >
                <Instagram className="w-5 h-5 sm:w-4 sm:h-4" />
              </a>
            </div>

            <a
              href="/pages/terms-conditions"
              className="text-sm text-brandBeige hover:text-brandBeige/70 transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
