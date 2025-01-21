import React from 'react';
import {Facebook, Instagram, Twitter} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-brandBeige font-poppins border-t border-brandBeige/10">
      <div className="container mx-auto px-4 py-6 md:py-4">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
          {/* Copyright and Developer Info */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center text-center md:text-left">
            <span className="text-sm">© {currentYear} SALTY.</span>
            <span className="text-sm md:before:content-['•'] md:before:mx-2 md:before:text-brandBeige/50">
              Developed by{' '}
              <a
                href="https://bio.site/youssefeltalyawy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brandBeige font-black hover:text-brandBeige/70 transition-colors underline-offset-4 hover:underline"
              >
                @yousefeltalyawy
              </a>
            </span>
          </div>

          {/* Social Links and Terms */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex justify-center gap-6 md:gap-4">
              <a
                href="https://facebook.com/salty.cai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brandBeige hover:text-brandBeige/70 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/salty.cai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brandBeige hover:text-brandBeige/70 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            <div className="flex justify-center md:before:content-['•'] md:before:mx-2 md:before:text-brandBeige/50">
              <a
                href="/pages/terms-conditions"
                className="text-sm text-brandBeige hover:text-brandBeige/70 transition-colors underline-offset-4 hover:underline"
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

export default Footer;
