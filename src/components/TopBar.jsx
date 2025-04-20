import React, { useEffect, useRef, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './TopBar.css';
import logo from '../assets/image.png';

const TopBar = ({ onLogoClick, onCartClick }) => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [animate, setAnimate] = useState(false);
  const isFirstRender = useRef(true);

  const username = window.Telegram?.WebApp?.initDataUnsafe?.user?.username || 'user';
  const avatar = window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url 

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (cart.length > 0) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 300);
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
        <div className='div-item' style={{ position: 'relative' }}>
          <ShoppingCart
            className={`button-icon ${animate ? 'shake' : ''}`}
            onClick={onCartClick}
          />
          {cart.length > 0 && (
            <span className="cart-count">{cart.length}</span>
          )}
        </div>
        <div className="div-item">
          {avatar ? (
            <img src={avatar} alt="avatar" className="avatar-img" />
          ) : (
            <span className="avatar-text">
              {username || 'User'}
            </span>
          )}
        </div>
      </section>
    </section>
  );
};

export default TopBar;
