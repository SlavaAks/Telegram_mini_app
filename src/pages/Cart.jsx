import React from 'react';
import TopBar from '../components/TopBar';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();

  return (
    <div className="">
      <TopBar
        onLogoClick={() => navigate('/')}
        onCartClick={() => {}}
      />

      <h2 className="">Корзина</h2>
      <button>Продолжить покупки</button>
      <p>....</p>
    </div>
  );
};

export default Cart;