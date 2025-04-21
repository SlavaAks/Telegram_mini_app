import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';
import CartItem from '../components/CartItem'; // Добавим импорт
import TopBar from '../components/TopBar';

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();
  console.log(cart)
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