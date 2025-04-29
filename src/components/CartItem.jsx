import React from 'react';
import './CartItem.css';
import { useNavigate } from 'react-router-dom';

const CartItem = ({ item, onRemove }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${item.articul}`);
  };

  return (
    <div className="cart-card" onClick={handleClick}>
      <div className="cart-card-content">
        <div className="cart-info">
          <h3>{item.brand} {item.model}</h3>
          <p>Артикул: <strong>{item.articul}</strong></p>
          <p>Размер: <strong>{item.size}</strong></p>
          <p>Цвет: <strong>{item.color}</strong></p>
          <p>Цена: <strong>{item.finalPrice} BYN</strong></p>
          <span className="remove-link"
            onClick={(e) => {
              e.stopPropagation(); // чтобы не переходило по клику на "удалить"
              onRemove(item.id_item);
            }}>
            Удалить
          </span>
        </div>
        <img src={item.image} alt={item.model} className="cart-image" />
      </div>
    </div>
  );
};

export default CartItem;