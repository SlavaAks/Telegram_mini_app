import React, { useEffect, useRef, useState } from 'react';
import { ShoppingCart, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './TopBar.css';
import logo from '../assets/image.png';

const TopBar = ({ onLogoClick, onCartClick }) => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [animate, setAnimate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const isFirstRender = useRef(true);

  const username = window.Telegram?.WebApp?.initDataUnsafe?.user?.username || 'user';
  const avatar = window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url;


  // 👇 Обработчик клика вне меню
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);


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
          <img src={logo} alt="Logo" className="img-logo" onClick={onLogoClick} />
        </div>
        <div className='div-item channel-menu-wrapper' ref={menuRef}>
          <button className="channel-button" onClick={() => setMenuOpen(!menuOpen)}>
            Telegram <ChevronDown size={14} />
          </button>
          {menuOpen && (
            <div className="channel-dropdown">
              <a href="https://t.me/Lapti_by" target="_blank" rel="noopener noreferrer">📢 Telegram канал c обувью</a>
              <a href="https://t.me/Lawka_by" target="_blank" rel="noopener noreferrer">📢 Telegram канал c одеждой</a>
            </div>
          )}
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
