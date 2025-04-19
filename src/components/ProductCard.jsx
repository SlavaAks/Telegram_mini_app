import React from 'react';
import './ProductCard.css';

const ProductCard = ({ image, model, price, discount, onClick }) => {
  const discountedPrice = discount ? price - (price * discount) / 100 : price;

  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-image-wrapper">
        <img src={image} alt={model} className="product-image" />
        {discount && <div className="product-discount">-{discount}%</div>}
      </div>

      <div className="product-info">
        <h3 className="product-model">{model}</h3>
        <div className="product-price">
          {discount ? (
            <>
              <span className="product-price-discounted">
                {Math.round(discountedPrice)} BYN
              </span>
              <span className="product-price-original">
                {price} BYN
              </span>
            </>
          ) : (
            <span>{price} BYN</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;