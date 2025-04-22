import React, { useState, useEffect, useCallback } from 'react';
import './Checkout.css';
import TopBar from '../components/TopBar';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import request from '../utils/api.ts';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  const WebApp = window.Telegram?.WebApp;


  const getFormvalues = ()=>{
    const storedValues =localStorage.getItem('checkoutForm')
    if (!storedValues) return {
      fullName: '',
      phone: '',
      email: '',
      size: '',
      deliveryMethod: '',
      address: '',
      zip: '',
      discount: ''
    }
  return JSON.parse(storedValues);
  }

  const [form, setForm] = useState(getFormvalues)

  // Загрузка данных из localStorage при монтировании компонента
  useEffect(() => {
    const savedForm = localStorage.getItem('checkoutForm');
    if (savedForm) {
      try {
        const parsedForm = JSON.parse(savedForm);
        // Только если данные корректны, устанавливаем их в состояние
        if (parsedForm && typeof parsedForm === 'object') {
          setForm(parsedForm);
        }
      } catch (error) {
        console.warn('Ошибка парсинга данных из localStorage:', error);
      }
    }
  }, []);

  // Сохранение данных в localStorage при изменении состояния
  useEffect(() => {
    if (form) {
      localStorage.setItem('checkoutForm', JSON.stringify(form));
    }
  }, [form]);


  useEffect(() => {
    if (WebApp?.BackButton) {
      WebApp.BackButton.show();

      WebApp.BackButton.onClick(() => {
        navigate(-1); // вернуться назад
      });

      return () => {
        WebApp.BackButton.hide(); // скрыть при размонтировании
        WebApp.BackButton.offClick(); // очистить обработчик
      };
    }
  }, [navigate, WebApp]);




  const isEmailValid = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid =
    form.fullName &&
    form.phone &&
    form.email &&
    isEmailValid(form.email) &&
    form.size &&
    form.deliveryMethod &&
    form.address;


  const handleSubmit = useCallback(async () => {
    if (!isFormValid || !WebApp) return;

    console.log(cart.length)
    if (cart.length > 5) {
      WebApp.showAlert("Превышен лимит покупок! Удалите некоторые товары с корзины, допустимое количество не болee 5 товаров");
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
      timestamp: new Date().toISOString()
    };

    try {
      await request('order', 'POST', payload);

      // Показываем алерт
      WebApp.showAlert("🎉 Ваш заказ успешно оформлен!");

      // Очищаем корзину (если хочешь)
      cart.forEach(item => removeFromCart(item.id_item));

      navigate('/')
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
    <section className="section-page">
      <div className="sticky-header">
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
        {renderInput('Телефон', 'phone', '+375 (29) 999-99-99', 'text', true)}
        <div>
          <label style={{ color: form.email && !isEmailValid(form.email) ? 'red' : '#000' }}>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className={!isEmailValid(form.email) && form.email ? 'input-error' : ''}
          />
        </div>
        {renderInput('Длина стопы (см)*', 'size', '', 'number', true)}

        <div className='select-form'>
          <label style={{ color: form.deliveryMethod ? '#000' : 'red' }}>Способ получения</label>
          <select name="deliveryMethod" value={form.deliveryMethod} onChange={handleChange} required>
            <option value="">Выберите</option>
            <option value="Белпочта">Белпочта</option>
            <option value="Европочта">Европочта</option>
            <option value="Самовывоз">Самовывоз</option>
          </select>
        </div>

        {renderInput('Адрес доставки', 'address', 'Город, Улица, дом, квартира', 'text', true)}
        {renderInput('Почтовый индекс', 'zip', '210000')}
        <div className='select-form'>
          <label>Ваша скидка</label>
          <select name="discount" value={form.discount} onChange={handleChange} required>
            <option value="">Выберите</option>
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
