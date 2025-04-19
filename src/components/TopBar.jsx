import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tg } from '../telegram';
import useCart from '../hooks/useCart';
import './TopBar.css';
import logo from '../assets/React-icon.svg';

const TopBar = ({ onLogoClick, onCartClick }) => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (cart.length > 0) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 400); // дольше для shake
      return () => clearTimeout(timeout);
    }
  }, [cart.length]);

  return (
    <section className='main-section'>
      <section className='top-section'>
        <div className='div-item'>
          <img
            src={logo}
            alt="Logo"
            className="img-logo"
            onClick={onLogoClick}
          />
        </div>
      </section>
      <section className='last-section'>
        <div className='div-item cart-wrapper' onClick={onCartClick}>
          <ShoppingCart className={`button-icon cart-icon ${animate ? 'shake' : ''}`} />
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </div>
        <div className='div-item'>
          <span className="avatar">
            {tg.initDataUnsafe?.user?.username || 'user'}
          </span>
        </div>
      </section>
    </section>
  );
};

export default TopBar;
