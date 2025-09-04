import { useState, useEffect } from 'react';

/**
 * A custom hook for persisting state to localStorage.
 * It synchronizes state with localStorage, retrieving the stored value on initialization
 * and saving it whenever it changes.
 * @param key The key to use in localStorage.
 * @param initialValue The initial value to use if nothing is in localStorage.
 * @returns A stateful value, and a function to update it.
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value.
  // The initial state is determined by reading from localStorage.
  const [storedValue, setStoredValue] = useState<T>(() => {
    // This logic should only execute on the client-side.
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Attempt to get the value from local storage by key.
      const item = window.localStorage.getItem(key);
      // Parse the stored JSON or return the initial value if it doesn't exist.
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If there's an error (e.g., parsing error), log it and return the initial value.
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  // useEffect to update local storage whenever the state value changes.
  useEffect(() => {
    try {
      // Ensure this only runs on the client-side.
      if (typeof window !== 'undefined') {
        // Save the current state to local storage.
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export { useLocalStorage };
