import {CartForm} from '@shopify/hydrogen';
import {Loader2, X} from 'lucide-react';
import {useRef, useState} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes =
    discountCodes?.filter((d) => d.applicable)?.map(({code}) => code) || [];

  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      {/* Active Discounts */}
      {codes.length > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Discount</span>
          <UpdateDiscountForm>
            <div className="flex items-center gap-2">
              <code className="text-green-600">{codes.join(', ')}</code>
              <button className="text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      )}

      {/* Discount Input */}
      {showInput ? (
        <UpdateDiscountForm discountCodes={codes}>
          {(fetcher) => {
            //Handle loaiding state
            const isLoading = fetcher.state;
            return (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    name="discountCode"
                    placeholder="Enter Discount Code"
                    className="w-full px-3 py-2 border border-brandBeige rounded focus:border-brandBeige font-poppins text-sm"
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absloute right-2 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className={`px-4 py-2 bg-brandBeige text-black text-sm font-poppins transition-colors duration-300 ${
                      isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-[#8f8f8f]'
                    }`}
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInput(false)}
                    className="px-4 py-2 border border-gray-200 rounded text-sm font-poppins hover:border-gray-300 transition-colors duration-300"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          }}
        </UpdateDiscountForm>
      ) : (
        <button>Add Discount Code</button>
      )}
      {/* <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <input
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className="flex-1 px-2.5 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm> */}
    </div>
  );
}
const UpdateDiscountForm = ({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode | ((fetcher: any) => React.ReactNode);
}) => (
  <CartForm
    route="/cart"
    action={CartForm.ACTIONS.DiscountCodesUpdate}
    inputs={{discountCodes: discountCodes || []}}
  >
    {children}
  </CartForm>
);
export default CartDiscounts;
