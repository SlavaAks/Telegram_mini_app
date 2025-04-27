import { useEffect, useState } from 'react';

export const useTelegramViewport = () => {
  const [viewportHeight, setViewportHeight] = useState(
    window.Telegram?.WebApp?.viewportHeight || window.innerHeight
  );

  useEffect(() => {
    const updateHeight = () => {
      const height = window.Telegram?.WebApp?.viewportHeight || window.innerHeight;
      setViewportHeight(height);
    };

    // Сразу обновляем
    updateHeight();

    // Подписка на событие изменения вьюпорта
    window.Telegram?.WebApp?.onEvent('viewportChanged', updateHeight);

    // Чистка события при размонтировании
    return () => {
      window.Telegram?.WebApp?.offEvent('viewportChanged', updateHeight);
    };
  }, []);

  return viewportHeight;
};