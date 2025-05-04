import { useEffect, useState } from 'react';

export const useTelegramViewport = () => {
  const [viewportHeight, setViewportHeight] = useState(
    window.Telegram?.WebApp?.viewportHeight || window.innerHeight
  );

  useEffect(() => {
    let timeoutId = null;

    const updateHeight = () => {
      const height = window.Telegram?.WebApp?.viewportHeight || window.innerHeight;
      
      // Добавляем задержку
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setViewportHeight(height);
      }, 200);
    };

    updateHeight();

    window.Telegram?.WebApp?.onEvent('viewportChanged', updateHeight);

    return () => {
      window.Telegram?.WebApp?.offEvent('viewportChanged', updateHeight);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return viewportHeight;
};
