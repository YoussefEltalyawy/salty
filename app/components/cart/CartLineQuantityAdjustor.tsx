import type {OptimisticCartLine} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import CartLineUpdateButton from './CartLineUpdateButton';
import CartLineRemoveButton from './CartLineRemoveButton';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

type CartLineQuantityAdjustorProps = {
  line: CartLine;
};

function CartLineQuantityAdjustor({line}: CartLineQuantityAdjustorProps) {
  if (!line || typeof line.quantity === 'undefined') {
    return null;
  }
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number(Math.round(quantity + 1));
  return (
    <div className="flex items-center gap-2">
      <CartLineUpdateButton>
        <button className=""></button>
      </CartLineUpdateButton>
      <span className="w-8 text-center">{quantity}</span>
      <CartLineUpdateButton></CartLineUpdateButton>
      <CartLineRemoveButton />
    </div>
  );
}

export default CartLineQuantityAdjustor;
