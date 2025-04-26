import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';
import CartItem from '../components/CartItem'; // Добавим импорт
import TopBar from '../components/TopBar';

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const WebApp = window.Telegram?.WebApp;

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

  return (
    <div className="cart-page">
      <TopBar
        onLogoClick={() => navigate('/')}
        onCartClick={() => navigate('/cart')}
      />
      <div className="cart-header">
        <h2>Корзина</h2>
        <button className="continue-btn" onClick={() => navigate('/')}>
          Продолжить покупки
        </button>
      </div>

      {cart.length === 0 ? (
        <p>Ваша корзина пуста</p>
      ) : (
        <div className="cart-list">
          {cart.map((item) => (
            <CartItem key={item.id_item} item={item} onRemove={removeFromCart} />
          ))}
          <div className="checkout-wrapper">
        <button className="checkout-btn" onClick={() => navigate('/checkout')}>
      🛒 Оформить заказ
        </button>
        </div>
        </div>
        
      )}
    </div>
  );
};

export default Cart;