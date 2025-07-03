import {useLocation} from '@remix-run/react';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {useMemo} from 'react';

type VariantUrlOptions = {
  /** The product handle */
  handle: string;
  /** The current pathname */
  pathname: string;
  /** URLSearchParams instance */
  searchParams: URLSearchParams;
  /** Selected product options */
  selectedOptions?: SelectedOption[];
  /** Optional variant ID to include in the URL */
  variantId?: string | null;
};

/**
 * Hook to generate a URL for a product variant with the current locale
 * @param handle - The product handle
 * @param selectedOptions - Optional selected variant options
 * @param variantId - Optional variant ID to include in the URL
 * @returns URL string for the variant
 */
export function useVariantUrl(
  handle: string,
  selectedOptions?: SelectedOption[],
  variantId?: string | null,
) {
  const {pathname, search} = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  return useMemo(() => {
    return getVariantUrl({
      handle,
      pathname,
      searchParams: new URLSearchParams(searchParams),
      selectedOptions,
      variantId,
    });
  }, [handle, selectedOptions, pathname, searchParams, variantId]);
}

/**
 * Generate a URL for a product variant with the given options
 * @param options - Options for generating the variant URL
 * @returns URL string for the variant
 */
export function getVariantUrl({
  handle,
  pathname,
  searchParams = new URLSearchParams(),
  selectedOptions = [],
  variantId,
}: Partial<VariantUrlOptions> & {handle: string; pathname: string}) {
  // Extract locale from pathname if present (e.g., /en-us/...)
  const localeMatch = /^\/([a-z]{2}(?:-[a-z]{2})?)\//i.exec(pathname);
  const localePrefix = localeMatch ? `/${localeMatch[1]}` : '';

  // Create base product URL with locale
  const baseUrl = `${localePrefix}/products/${handle}`;
  const params = new URLSearchParams(searchParams);

  // Add selected options to search params
  selectedOptions.forEach(({name, value}) => {
    if (name && value) {
      params.set(name, value);
    }
  });

  // Add variant ID if provided
  if (variantId) {
    params.set('variant', variantId);
  }

  // Remove any empty parameters
  Array.from(params.entries()).forEach(([key, value]) => {
    if (!value) params.delete(key);
  });

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
