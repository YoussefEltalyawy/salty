import {createContext, useContext, useEffect, useState} from 'react';
import type {KeyboardEvent, ReactNode} from 'react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    if (!expanded) return;
    const scrollY = window.scrollY;

    const originalStyles = {
      overflow: document.body.style.overflow,
      height: document.body.style.height,
      position: document.body.style.position,
      width: document.body.style.width,
      top: document.body.style.top,
    };

    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.style.overflow = originalStyles.overflow;
      document.body.style.height = originalStyles.height;
      document.body.style.position = originalStyles.position;
      document.body.style.width = originalStyles.width;
      document.body.style.top = originalStyles.top;

      window.scrollTo(0, scrollY);
    };
  }, [expanded]);
  useEffect(() => {
    if (!expanded) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'ESC') {
        close();
      }
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    };
  }, [expanded, close]);
  return (
    <div
      aria-modal
      className={`
        fixed inset-0 z-50 transition-opacity duration-300 ease-in-out
        ${expanded ? 'opactiy-100' : 'opacity-0 pointer-events-none'}
      `}
      role="dialog"
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/30`}
        onClick={close}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            close();
          }
        }}
      ></div>
      {/* Aside Panel */}
      <aside
        className={`
          flex flex-col absolute top-0 right-0 h-[100dvh] w-full max-w-md 
          bg-white shadow-xl
          transform transition-transform duration-300 ease-in-out font-poppins
          ${expanded ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-6 mt-1 border-b border-gray-300">
          <h3 className="text-xl font-semibold">{heading}</h3>
          <button
            onClick={close}
            className="rounded-full"
            aria-label="Close panel"
          >
            <span className="sr-only">Close</span>✕
          </button>
        </header>
        {/* Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
