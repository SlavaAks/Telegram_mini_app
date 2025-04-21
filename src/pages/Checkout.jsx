import React, { useState, useEffect, useCallback } from 'react';
import './Checkout.css';
import TopBar from '../components/TopBar';
import CartItem from '../components/CartItem'

const Checkout = () => {
  const WebApp = window.Telegram?.WebApp;
  const mainButton = WebApp?.MainButton;
  const backButton = WebApp?.BackButton;
  const initDataUnsafe = WebApp?.initDataUnsafe;

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    size: '',
    deliveryMethod: '',
    address: '',
    zip: '',
    promo: ''
  });

  const isEmailValid = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid =
    form.fullName &&
    form.phone &&
    form.email &&
    isEmailValid(form.email) &&
    form.size &&
    form.deliveryMethod &&
    form.address;

  // Автозаполнение имени
  useEffect(() => {
    if (initDataUnsafe?.user) {
      setForm(prev => ({
        ...prev,
        fullName: `${initDataUnsafe.user.first_name} ${initDataUnsafe.user.last_name || ''}`.trim()
      }));
    }
  }, [initDataUnsafe]);

  // Обработка mainButton
  useEffect(() => {
    if (!mainButton) return;
    if (isFormValid) {
      mainButton.show();
      mainButton.setText('Завершить заказ');
    } else {
      mainButton.hide();
    }
  }, [form, isFormValid]);

  const handleSubmit = useCallback(() => {
    if (!isFormValid || !WebApp) return;

    const payload = {
      ...form,
      timestamp: new Date().toISOString()
    };

    console.log('Заказ оформлен:', payload);
    WebApp.sendData(JSON.stringify(payload));
    WebApp.close();
  }, [form, isFormValid]);

  useEffect(() => {
    if (!mainButton || !backButton) return;

    mainButton.onClick(handleSubmit);
    backButton.onClick(() => window.history.back());

    return () => {
      mainButton.offClick(handleSubmit);
      backButton.offClick();
    };
  }, [handleSubmit]);

  const handleChange = e => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="checkout-container">
      <h2>Оформление заказа</h2>

      <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="ФИО" required />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Телефон" required />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className={!isEmailValid(form.email) && form.email ? 'invalid' : ''}
      />
      <input name="size" value={form.size} onChange={handleChange} placeholder="Размер" required />

      <select name="deliveryMethod" value={form.deliveryMethod} onChange={handleChange} required>
        <option value="">Способ получения</option>
        <option value="pickup">Самовывоз</option>
        <option value="courier">Курьер</option>
      </select>

      <input name="address" value={form.address} onChange={handleChange} placeholder="Адрес доставки" required />
      <input name="zip" value={form.zip} onChange={handleChange} placeholder="Почтовый индекс" />
      <input name="promo" value={form.promo} onChange={handleChange} placeholder="Промокод" />
    </div>
  );
};

export default Checkout;
