import {
  useFetcher,
  useNavigate,
  type FormProps,
  type Fetcher,
} from '@remix-run/react';
import React, {useRef, useEffect} from 'react';
import type {PredictiveSearchReturn} from '~/lib/search';
import {useAside} from './Aside';
import {Search} from 'lucide-react';

type SearchFormPredictiveChildren = (args: {
  fetchResults: (event: React.ChangeEvent<HTMLInputElement>) => void;
  goToSearch: () => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  fetcher: Fetcher<PredictiveSearchReturn>;
}) => React.ReactNode;

type SearchFormPredictiveProps = Omit<FormProps, 'children'> & {
  children: SearchFormPredictiveChildren | null;
};

export const SEARCH_ENDPOINT = '/search';

export function SearchFormPredictive({
  children,
  className = 'predictive-search-form',
  ...props
}: SearchFormPredictiveProps) {
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const aside = useAside();

  function resetInput(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (inputRef?.current?.value) {
      inputRef.current.blur();
    }
  }

  function goToSearch() {
    const term = inputRef?.current?.value;
    navigate(SEARCH_ENDPOINT + (term ? `?q=${term}` : ''));
    aside.close();
  }

  function fetchResults(event: React.ChangeEvent<HTMLInputElement>) {
    fetcher.submit(
      {q: event.target.value || '', limit: 5, predictive: true},
      {method: 'GET', action: SEARCH_ENDPOINT},
    );
  }

  useEffect(() => {
    inputRef?.current?.setAttribute('type', 'search');
  }, []);

  if (typeof children !== 'function') {
    return null;
  }

  return (
    <fetcher.Form
      {...props}
      className={`${className} relative max-w-2xl mx-auto w-full font-poppins`}
      onSubmit={resetInput}
    >
      <div className="relative flex">
        {children({inputRef, fetcher, fetchResults, goToSearch})}
      </div>
    </fetcher.Form>
  );
}
