import {useRef, useEffect} from 'react';
import {Form, type FormProps} from '@remix-run/react';
import {Search} from 'lucide-react';

type SearchFormProps = Omit<FormProps, 'children'> & {
  children: (args: {
    inputRef: React.RefObject<HTMLInputElement>;
  }) => React.ReactNode;
};

export function SearchForm({children, ...props}: SearchFormProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useFocusOnCmdK(inputRef);

  if (typeof children !== 'function') {
    return null;
  }

  return (
    <Form
      method="get"
      {...props}
      className="relative max-w-2xl mx-auto w-full font-poppins"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        {children({inputRef})}
      </div>
    </Form>
  );
}

function useFocusOnCmdK(inputRef: React.RefObject<HTMLInputElement>) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && event.metaKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === 'Escape') {
        inputRef.current?.blur();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputRef]);
}
