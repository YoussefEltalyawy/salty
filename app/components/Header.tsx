import {Suspense, useEffect, useState} from 'react';
import {Await, NavLink, useAsyncValue, useLocation} from '@remix-run/react';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Menu, Search, ShoppingBag, User} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

// Header Component
export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const {type: asideType} = useAside();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--announcment-height', isScrolled ? '0px' : '40px');
    root.style.setProperty('--header-height', isScrolled ? '64px' : '80px');

    const handleScroll = () => {
      if (asideType !== 'closed') return;
      const currentScrollY = window.scrollY;
      setIsScrollingUp(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isScrolled, asideType]);

  if (isHomePage) {
    return (
      <div
        className={`fixed w-full z-20 transition-all duration-500 ease-in-out 
        ${
          isScrollingUp && isScrolled && asideType === 'closed'
            ? 'translate-y-0'
            : '-translate-y-0'
        }`}
      >
        {/* Announcement Bar */}
        <div
          className={`w-full bg-brandBeige text-black transition-all duration-500 ease-in-out
        ${isScrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'}`}
        >
          <div className="container mx-auto text-center py-2.5">
            <p className="font-poppins text-sm font-light">
              Free shipping for orders above 1500 EGP!
            </p>
          </div>
        </div>
        {/* Home Page Header */}
        <div className="relative w-full bg-transparent backdrop-blur-sm z-10">
          <header className="mx-auto flex items-center justify-between px-12 py-4 text-white">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <HeaderMenuMobileToggle />
              <User className="w-6 h-6 lg:w-7 lg:h-7" />
            </div>

            {/* Center Section - Logo */}
            <div className="flex-1 flex justify-center">
              <NavLink to="/" prefetch="intent">
                <img
                  src="/logo.png"
                  alt={shop.name}
                  className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 transition-all duration-300"
                />
              </NavLink>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <SearchToggle />
              <CartToggle cart={cart} />
            </div>
          </header>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed w-full z-20 transition-all duration-500 ease-in-out 
        ${
          isScrollingUp && isScrolled && asideType === 'closed'
            ? 'translate-y-0'
            : '-translate-y-0'
        }`}
    >
      {/* Other Pages Header */}
      <div className="relative w-full bg-transparent bg-black z-10">
        <header className="mx-auto flex items-center justify-between px-12 py-4 text-white">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <HeaderMenuMobileToggle />
            <User className="w-6 h-6 lg:w-7 lg:h-7" />
          </div>

          {/* Center Section - Logo */}
          <div className="flex-1 flex justify-center">
            <NavLink to="/" prefetch="intent">
              <img
                src="/logo.png"
                alt={shop.name}
                className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 transition-all duration-300"
              />
            </NavLink>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <SearchToggle />
            <CartToggle cart={cart} />
          </div>
        </header>
      </div>
    </div>
  );
}

// Header Menu Component
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  return (
    <nav className={className} role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

// Header Call-to-Actions
function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

// Mobile Menu Toggle
function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="p-2 -ml-2 hover:text-white/80 transition-opacity"
      onClick={() => open('mobile')}
    >
      <Menu className="w-6 h-6 lg:w-7 lg:h-7" />
    </button>
  );
}

// Search Toggle
function SearchToggle() {
  const {open} = useAside();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <button className="reset" onClick={() => open('search')}>
      <Search
        className={`w-6 h-6 lg:w-7 lg:h-7 ${
          isHomePage ? 'text-white' : 'text-black'
        }`}
      />
    </button>
  );
}

// Cart Badge
function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <button
      type="button"
      aria-label="Open cart"
      onClick={() => {
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      className="relative inline-flex items-center"
    >
      <ShoppingBag
        size={24}
        className={isHomePage ? 'text-white' : 'text-black'}
      />
      {count !== null && (
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brandBeige text-xs text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

// Cart Toggle
function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

// Cart Banner
function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

// Fallback Menu
const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

// Active Link Style
function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
