import {Suspense, useEffect, useState} from 'react';
import {
  Await,
  Link,
  NavLink,
  useAsyncValue,
  useLocation,
} from '@remix-run/react';
import {
  type CartViewPayload,
  Image,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {ChevronRight, Menu, Search, ShoppingBag, User} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}
type Viewport = 'desktop' | 'mobile';

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
  const {type: asideType} = useAside();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerContent = (
    <>
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <HeaderMenuMobileToggle />
        <Link to="/account" prefetch="intent">
          <User className="w-6 h-6 lg:w-7 lg:h-7" />
        </Link>
      </div>

      {/* Center Section - Logo */}
      <div className="flex-1 flex justify-center">
        <NavLink to="/" prefetch="intent">
          <Image
            src="/logo.png"
            alt={shop.name}
            width={80} // 20 * 4 to match lg size
            height={80} // 20 * 4 to match lg size
            className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 transition-all duration-300"
          />
        </NavLink>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <SearchToggle />
        <CartToggle cart={cart} />
      </div>
    </>
  );

  return (
    <div
      className={` z-20 ${
        isHomePage ? 'fixed top-0 left-0 right-0' : 'static'
      }`}
    >
      {/* Announcement Bar */}
      <div
        className={`
          w-full 
          bg-brandBeige 
          text-black 
          transition-all 
          duration-500 
          ease-in-out
          overflow-hidden
          ${isScrolled ? 'h-0' : 'h-10'}
        `}
      >
        <div className="container mx-auto text-center py-2.5">
          <p className="font-poppins text-sm font-light">
            Free shipping for orders above 1500 EGP!
          </p>
        </div>
      </div>

      {/* Header */}
      <div
        className={`
          w-full 
          transition-all 
          duration-500 
          ease-in-out
          ${isHomePage ? 'bg-transparent backdrop-blur-sm' : 'bg-black'}
        `}
      >
        <header className="mx-auto flex items-center justify-between px-12 py-4 text-white">
          {headerContent}
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

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (itemId: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const renderMenuItem = (item: any, depth = 0) => {
    if (!item.url) return null;

    const hasSubmenu = item.items?.length > 0;
    const isSubmenuOpen = openSubmenus[item.id];
    const url =
      item.url.includes('myshopify.com') ||
      item.url.includes(publicStoreDomain) ||
      item.url.includes(primaryDomainUrl)
        ? new URL(item.url).pathname
        : item.url;

    const handleClick = (e: React.MouseEvent) => {
      if (hasSubmenu) {
        e.preventDefault();
        toggleSubmenu(item.id);
      } else {
        close();
      }
    };

    return (
      <div key={item.id} className="w-full">
        <div className="flex items-center justify-between w-full">
          <NavLink
            className={`header-menu-item flex-1 ${
              isSubmenuOpen ? 'active' : ''
            }`}
            end
            onClick={handleClick}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>

          {hasSubmenu && (
            <button
              className="p-2 -mr-2 transition-transform duration-200"
              onClick={(e) => {
                e.preventDefault();
                toggleSubmenu(item.id);
              }}
              aria-expanded={isSubmenuOpen}
              aria-label={`Toggle ${item.title} submenu`}
            >
              <ChevronRight
                className={`w-5 h-5 transition-transform duration-200 ${
                  isSubmenuOpen ? 'rotate-90' : ''
                }`}
              />
            </button>
          )}
        </div>

        {hasSubmenu && (
          <div
            className={`submenu space-y-3 pl-4 transition-all duration-300 ease-in-out ${
              isSubmenuOpen
                ? 'max-h-screen opacity-100 mt-1'
                : 'max-h-0 opacity-0'
            }`}
            style={{
              visibility: isSubmenuOpen ? 'visible' : 'hidden',
            }}
          >
            {item.items.map((subItem: any) =>
              renderMenuItem(subItem, depth + 1),
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`${className} space-y-1`} role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map(renderMenuItem)}
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
// Search Toggle
function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      <Search className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
    </button>
  );
}

// Cart Badge
function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
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
      <ShoppingBag size={24} />
      {count !== null && (
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brandBeige text-xs text-white">
          {count}
        </span>
      )}
    </a>
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
