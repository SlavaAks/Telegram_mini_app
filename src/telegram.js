export const tg = window.Telegram?.WebApp;

export const initTelegram = () => {
  try {
    if (!tg) {
      throw new Error("Telegram WebApp не доступен");
    }

    tg.ready();    // Сообщаем Telegram, что приложение готово
    tg.expand();   // Разворачиваем WebApp
  } catch (error) {
    console.error('Ошибка инициализации Telegram WebApp:', error);
  }
};