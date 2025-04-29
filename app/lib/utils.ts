import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A wrapper for localStorage that safely handles server-side rendering
 * and cases where localStorage may not be available.
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};
