import { useState, useEffect, useCallback } from 'react';

export function getStorageItem<T>(key: string, initialValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return initialValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Dispatch a custom event so hooks in the same window can react
    window.dispatchEvent(new CustomEvent('local-storage-sync', { detail: { key } }));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

export function useLocalState<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Read initial state from localStorage or use initialValue
  const [state, setState] = useState<T>(() => getStorageItem<T>(key, initialValue));

  // Return a wrapped setState that also updates localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setState((prevState) => {
        const newValue = value instanceof Function ? value(prevState) : value;
        setStorageItem(key, newValue);
        return newValue;
      });
    },
    [key]
  );

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setState(getStorageItem<T>(key, initialValue));
      }
    };

    const handleCustomSync = (event: CustomEvent) => {
      if (event.detail.key === key) {
        setState(getStorageItem<T>(key, initialValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-sync', handleCustomSync as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-sync', handleCustomSync as EventListener);
    };
  }, [key, initialValue]);

  return [state, setValue];
}
