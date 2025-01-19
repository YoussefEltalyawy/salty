import {Link, useNavigate} from '@remix-run/react';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();

  return (
    <div className="space-y-6 font-poppins">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div key={option.name} className="space-y-4">
            <h5 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
              {option.name}
            </h5>
            <div className="grid grid-cols-3 gap-4">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const baseClassName = `
                  relative
                  flex
                  w-full
                  items-center
                  justify-center
                  p-3
                  rounded-lg
                  border-2
                  transition-all
                  ${
                    selected
                      ? 'border-brandBeige bg-white text-gray-900'
                      : 'border-transparent bg-gray-100 hover:bg-gray-200'
                  }
                  ${
                    !available &&
                    'opacity-50 cursor-not-allowed bg-gray-200 hover:bg-gray-200'
                  }
                `;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={baseClassName}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                }

                return (
                  <button
                    type="button"
                    className={baseClassName}
                    key={option.name + name}
                    disabled={!exists}
                    onClick={() => {
                      if (!selected) {
                        navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    <ProductOptionSwatch swatch={swatch} name={name} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        afterAddToCart={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) {
    return <span className="text-sm text-gray-700">{name}</span>;
  }

  return (
    <div
      aria-label={name}
      className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-gray-200"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {image && (
        <img src={image} alt={name} className="w-full h-full object-cover" />
      )}
    </div>
  );
}
