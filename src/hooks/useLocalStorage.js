import { useState } from 'react';

function useLocalStorage(key, initialValue) {
  let parsedValue;

  try {
    const stored = localStorage.getItem(key);
    parsedValue = stored ? JSON.parse(stored) : initialValue;
  } catch (error) {
    console.warn(`Ошибка чтения localStorage для ключа "${key}":`, error);
    parsedValue = initialValue;
  }

  const [value, setValue] = useState(parsedValue);

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}

export default useLocalStorage;
