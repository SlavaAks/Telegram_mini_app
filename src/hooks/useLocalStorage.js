import { useState } from 'react';

function useLocalStorage(key, initialValue) {
  // Получаем данные из localStorage при первом рендере
  const storedValue = localStorage.getItem(key);

  // Если данные есть, то используем их, иначе — начальное значение
  const [value, setValue] = useState(storedValue ? JSON.parse(storedValue) : initialValue);

  // Обновляем localStorage, когда значение меняется
  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue)); // сохраняем в localStorage
  };

  return [value, setStoredValue];
}

export default useLocalStorage;