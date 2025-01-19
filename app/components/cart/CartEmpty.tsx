import {Link} from '@remix-run/react';
import {useAside} from '../Aside';
import type {CartMainProps} from './CartMain';
import {ShoppingBag} from 'lucide-react';

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div hidden={hidden}>
      <div className="flex flex-col items-center justify-center h-96 px-6 text-center">
        <div className="mb-6 p-6 bg-gray-50 rounded-full">
          <ShoppingBag className="w-8 h-8 text-brandBeige" />
        </div>

        <h2 className="text-xl font-medium mb-2">
          Oops! Your cart is on a diet.
        </h2>

        <p className="text-gray-500 mb-8">
          Looks like you haven&apos;t added anything yet, Feed it with some
          amazing finds!
        </p>

        <Link
          to="/collections/all"
          onClick={close}
          prefetch="viewport"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors duration-200 rounded-full"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
export default CartEmpty;
