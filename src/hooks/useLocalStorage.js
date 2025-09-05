import { useState } from 'react';

function useLocalStorage(key, initialValue, reset = false) {
  const [storedValue, setStoredValue] = useState(() => {
    if (reset) {
      window.localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        return initialValue;
      }
      return JSON.parse(item) || initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;