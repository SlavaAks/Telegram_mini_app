import React from 'react';
import './CartItem.css';

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="cart-card">
      <div className="cart-card-content">
        <div className="cart-info">
          <h3>{item.brand} {item.model}</h3>
          <p>Артикул: <strong>{item.articul}</strong></p>
          <p>Размер: <strong>{item.size}</strong></p>
          <p>Цена: <strong>{item.finalPrice} BYN</strong></p>
          <span className="remove-link" onClick={() => onRemove(item.id_item)}>
            Удалить
          </span>
        </div>
        <img src={item.image} alt={item.model} className="cart-image" />
      </div>
    </div>
  );
};

export default CartItem;