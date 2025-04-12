import { initTelegramWebApp } from '@twa-dev/sdk';

export const tg = window.Telegram.WebApp;

export const initTelegram = () => {
  try {
    initTelegramWebApp(); // Инициализируем SDK
    tg.ready();           // Сообщаем Telegram, что приложение готово
    tg.expand();          // Разворачиваем приложение на весь экран
  } catch (error) {
    console.error('Ошибка инициализации Telegram WebApp:', error);
  }
};
