import {CartForm} from '@shopify/hydrogen';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {Loader2} from 'lucide-react';
import React, {useEffect, useState} from 'react';

type CartLineUpdateButtonProps = {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
};

function CartLineUpdateButton({lines, children}: CartLineUpdateButtonProps) {
  const [updating, setUpdating] = useState<boolean>(false);
  return (
    <div>
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{lines}}
      >
        {(fetcher) => {
          useEffect(() => {
            if (fetcher.state === 'loading') {
              setUpdating(true);
            } else if (fetcher.state === 'idle') {
              setTimeout(() => setUpdating(false), 200);
            }
          }, [fetcher.state]);
          if (updating) {
            // Loading state
            return (
              <div className="relative inline-flex itmes-center justify-center">
                <div className="opacity-50 pointer-events-none">{children}</div>
                <div className="absloute inset-0 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-brandBeige" />
                </div>
              </div>
            );
          }
          return children;
        }}
      </CartForm>
    </div>
  );
}

export default CartLineUpdateButton;
