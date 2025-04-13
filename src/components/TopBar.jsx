import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { tg } from '../telegram';
import './TopBar.css'

const TopBar = ({ onLogoClick, onCartClick }) => {
  return (
    <section className='main-section'>
      <section className='top-section'>
        <div className='div-item'>
          <img
            src="src\assets\React-icon.svg"
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
