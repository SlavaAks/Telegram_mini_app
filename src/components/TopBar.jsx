import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { tg } from '../telegram';
import './TopBar.css'
import logo from '../assets/React-icon.svg'

const TopBar = ({ onLogoClick, onCartClick, cartCount }) => {
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
        <div className='div-item'>
          <ShoppingCart
            className="button-icon"
            onClick={onCartClick}
          />
           {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
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
