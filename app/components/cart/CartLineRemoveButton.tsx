import {CartForm} from '@shopify/hydrogen';
import {Trash2, X} from 'lucide-react';
import React from 'react';

type CartLineRemoveButtonProps = {
  lineIds: string[];
  disabled: boolean;
};

function CartLineRemoveButton({lineIds, disabled}: CartLineRemoveButtonProps) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        className={`ml-3 text-gray-400 hover:text-gray-500 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </CartForm>
  );
}

export default CartLineRemoveButton;
