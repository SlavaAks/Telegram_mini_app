import React, { useState, useEffect, useCallback } from 'react';
import './Checkout.css';
import TopBar from '../components/TopBar';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import request from '../utils/api.ts';
import { useTelegramViewport } from '../hooks/useTelegramViewport';
import { number } from 'framer-motion';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  const WebApp = window.Telegram?.WebApp;
  const viewportHeight = useTelegramViewport();
  window.Telegram?.WebApp.disableVerticalSwipes();

  const getFormvalues = () => {
    const storedValues = localStorage.getItem('checkoutForm');
    if (!storedValues) return {
      fullName: '',
      phone: '',
      email: '',
      size: '',
      deliveryMethod: '',
      address: '',
      city: '',
      branchNumber: '',
      zip: '',
      discount: ''
    };
    return JSON.parse(storedValues);
  };

  const [form, setForm] = useState(getFormvalues);

  useEffect(() => {
    const savedForm = localStorage.getItem('checkoutForm');
    if (savedForm) {
      try {
        const parsedForm = JSON.parse(savedForm);
        if (parsedForm && typeof parsedForm === 'object') {
          setForm(parsedForm);
        }
      } catch (error) {
        console.warn('Ошибка парсинга данных из localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (form) {
      localStorage.setItem('checkoutForm', JSON.stringify(form));
    }
  }, [form]);

  useEffect(() => {
    if (WebApp?.BackButton) {
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(() => navigate(-1));
      return () => {
        WebApp.BackButton.hide();
        WebApp.BackButton.offClick();
      };
    }
  }, [navigate, WebApp]);


  const isValidPhone = (phone) => {
    const belarusPhoneRegex = /^(?:\+375|375|8\d{1})\(?\d{2}\)?\s?\d{3}-?\d{2}-?\d{2}$/;
    const russiaPhoneRegex = /^(?:\+7|7|8)\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/;
    
    return belarusPhoneRegex.test(phone) || russiaPhoneRegex.test(phone);
  };
  const isFormValid =
    form.fullName &&
    isValidPhone(form.phone) &&
    form.phone &&
    form.size &&
    form.deliveryMethod &&
    ((form.deliveryMethod === 'Белпочта' && form.address) ||
      (form.deliveryMethod === 'Европочта' && form.branchNumber) ||
      (form.deliveryMethod === 'Самовывоз' && form.city));

  const handleSubmit = useCallback(async () => {
    if (!isFormValid || !WebApp) return;

    if (cart.length > 5) {
      WebApp.showAlert("Превышен лимит покупок! Удалите некоторые товары с корзины, допустимое количество не более 5 товаров");
      return;
    }

    const cartItems = cart.map(item => ({
      title: `${item.brand} ${item.model}`,
      articul: item.articul,
      size: item.size,
      price: item.finalPrice
    }));

    const total = cart.reduce((sum, item) => sum + item.finalPrice, 0);

    const payload = {
      ...form,
      cart: cartItems,
      total,
      timestamp: new Date().toISOString(),
      telegram_link: WebApp.initDataUnsafe?.user?.id
        ? `https://t.me/${WebApp.initDataUnsafe.user.username || `user?id=${WebApp.initDataUnsafe.user.id}`}`
        : null,
    };

    try {
      await request('order', 'POST', payload);
      WebApp.showAlert("🎉 Ваш заказ успешно оформлен!");
      cart.forEach(item => removeFromCart(item.id_item));
      navigate('/');
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      WebApp.showAlert("❌ Произошла ошибка при оформлении заказа. Попробуйте позже.");
    }
  }, [form, isFormValid, WebApp, cart, removeFromCart]);

  const handleChange = e => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const renderInput = (label, name, placeholder = '', type = 'text', required = false) => (
    <div>
      <label style={{ color: required && !form[name] ? 'red' : '#000' }}>
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        className={required && !form[name] ? 'input-error' : ''}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <section className="section-page-checkout" style={{ height: viewportHeight }}>
      <div className="sticky-header-checkout">
        <TopBar
          onLogoClick={() => navigate('/')}
          onCartClick={() => navigate('/cart')}
        />
      </div>

      <div className="checkout-container">
        {cart.length > 0 && (
          <div className="cart-preview">
            <h3>Корзина</h3>
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="cart-item-info">
                  <strong>{item.brand} {item.model}</strong>
                  <div>Артикул: {item.articul}</div>
                  <div>Размер: {item.size}</div>
                  <div>Цвет: {item.color}</div>
                  <div>Цена: {item.finalPrice} BYN</div>
                </div>
                {item.image && (
                  <img src={item.image} alt={item.title} className="cart-item-image" />
                )}
              </div>
            ))}
            <div className="cart-total">
              <strong>Итого:</strong>{' '}
              {cart.reduce((total, item) => total + item.finalPrice, 0)} BYN
            </div>
          </div>
        )}
        {renderInput('ФИО получателя', 'fullName', 'Фамилия Имя Отчество', 'text', true)}
        <div>
          <label style={{ color: true && !isValidPhone(form.phone) ? 'red' : '#000' }}>
            Телефон
          </label>
          <input
            name={'phone'}
            type={'number'}
            value={form['phone']}
            onChange={handleChange}
            className={true && !form['phone'] ? 'input-error' : ''}
            placeholder={'+37529... или 37529... или 89123456789...'}
          />
        </div>

        <div className='select-form'>
          <label style={{ color: form.size ? '#000' : 'red' }}>Размер ступни (см)</label>
          <select name="size" value={form.size} onChange={handleChange} required>
            <option value="">Выберите</option>
            <option value="25.5">25.5 см</option>
            <option value="26">26 см</option>
            <option value="26.5">26.5 см</option>
            <option value="27.5">27.5 см</option>
            <option value="28">28 см</option>
            <option value="29">29 см</option>
            <option value="29.5">29.5 см</option>
          </select>
        </div>

        <div className='select-form'>
          <label style={{ color: form.deliveryMethod ? '#000' : 'red' }}>Способ получения</label>
          <select name="deliveryMethod" value={form.deliveryMethod} onChange={handleChange} required>
            <option value="">Выберите</option>
            <option value="Белпочта">Белпочта</option>
            <option value="Европочта">Европочта</option>
            <option value="Самовывоз">Самовывоз</option>
          </select>
        </div>

        {form.deliveryMethod === 'Белпочта' && (
          <>
            {renderInput('Адрес доставки', 'address', 'Город, Улица, дом, квартира', 'text', true)}
            {renderInput('Почтовый индекс', 'zip', '210000')}
          </>
        )}

        {form.deliveryMethod === 'Европочта' && (
          <>
            {renderInput('Номер или адрес отделения Европочты', 'branchNumber', 'Например: 12', 'text', true)}
          </>
        )}
        {form.deliveryMethod === 'Самовывоз' && (
          <div className='select-form'>
            <label style={{ color: form.city ? '#000' : 'red' }}>Город Минск/Витебск</label>
            <select name="city" value={form.city} onChange={handleChange} required>
              <option value="">Выберите</option>
              <option value="Минск">Минск</option>
              <option value="Витебск">Витебск</option>
            </select>
          </div>
        )}

        <div className='select-form'>
          <label>Ваша скидка</label>
          <select name="discount" value={form.discount} onChange={handleChange}>
            <option value="">Выберите</option>
            <option value="нет">нет</option>
            <option value="5">5%</option>
            <option value="7">7%</option>
            <option value="9">9%</option>
          </select>
        </div>

        <button className='back-to-cart' onClick={() => navigate('/cart')}>Назад в корзину</button>

      </div>

      <div className="checkout-footer">
        <button onClick={handleSubmit} disabled={!isFormValid}>
          {isFormValid ? 'Завершить заказ' : 'Заполните обязательные поля'}
        </button>
      </div>
    </section>
  );
};

export default Checkout;
