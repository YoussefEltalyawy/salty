import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/cart/CartMain';
import {
  CartForm,
  Money,
  type OptimisticCart,
  useAnalytics,
} from '@shopify/hydrogen';
import {useRef} from 'react';
import {Link, type FetcherWithComponents} from '@remix-run/react';
import {ArrowRight, X} from 'lucide-react';
import CartDiscounts from './CartDiscounts';
import {useAside} from '../Aside';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const {close} = useAside();
  const isPage = layout === 'page';
  // fixed bottom-4 left-4 z-50 w-full pr-8
  return (
    <div
      className={`
      fixed bottom-4 left-4 z-50 w-full pr-8
      bg-white
    `}
    >
      <div className="p-4">
        <div className="space-y-3">
          {/* Continue Shopping */}
          <Link
            to="/collections/all"
            onClick={close}
            className="flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors bg-brandBeige rounded-md hover:bg-brandBeige/80"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">
              {cart.cost?.subtotalAmount?.amount ? (
                <Money data={cart.cost?.subtotalAmount} />
              ) : (
                '-'
              )}
            </span>
          </div>
          {/* Checkout Button */}
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </div>
      </div>
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  const {publish, shop, cart} = useAnalytics();

  if (!checkoutUrl) return null;

  const handleCheckout = (e: React.MouseEvent) => {
    // Publish checkout started event
    publish('custom_checkout_started', {
      cart,
      shop,
      url: window.location.href || '',
      checkoutUrl,
    });
  };

  return (
    <a
      href={checkoutUrl}
      target="_self"
      onClick={handleCheckout}
      className="block w-full bg-black text-white text-center py-2.5 px-4 rounded-md hover:bg-gray-800 transition-colors mt-4"
    >
      Continue to Checkout
    </a>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const codes =
    giftCardCodes?.map(({lastCharacters}) => `•••${lastCharacters}`) || [];

  const saveAppliedCode = (code: string) => {
    const formattedCode = code.replace(/\s/g, '');
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    if (giftCardCodeInput.current) giftCardCodeInput.current.value = '';
  };

  return (
    <div className="space-y-2">
      {/* Active Gift Cards */}
      {codes.length > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Gift Card</span>
          <UpdateGiftCardForm>
            <div className="flex items-center gap-2">
              <code className="text-green-600">{codes.join(', ')}</code>
              <button className="text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </UpdateGiftCardForm>
        </div>
      )}

      {/* Gift Card Input */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div className="flex gap-2">
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            className="flex-1 px-2.5 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Apply
          </button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

const UpdateGiftCardForm = ({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  children: React.ReactNode;
}) => (
  <CartForm
    route="/cart"
    action={CartForm.ACTIONS.GiftCardCodesUpdate}
    inputs={{giftCardCodes: giftCardCodes || []}}
  >
    {(fetcher: FetcherWithComponents<any>) => {
      const code = fetcher.formData?.get('giftCardCode');
      if (code && saveAppliedCode) saveAppliedCode(code as string);
      return children;
    }}
  </CartForm>
);
