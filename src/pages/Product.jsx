import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Product.css";
import TopBar from '../components/TopBar';

const Product = ({ onAddToCart }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);

  if (!state || !state.product) {
    return <p>Товар не найден</p>;
  }

  const {
    id,
    brand,
    name,
    image,
    availableSizes,
    price,
    discountSize = [],
    discount,
    category,
  } = state.product;

  const hasDiscount = selectedSize && discountSize.includes(selectedSize);
  const finalPrice = hasDiscount && discount
    ? Math.round(price - price * discount / 100)
    : price;


  const handleAddToCartClick = () => {
      if (selectedSize) {
        onAddToCart();  // Вызываем метод для обновления количества товаров в корзине
      }
    };
  return (
    <div className="product-page">
      <div className="top-bar-wrapper">
        <TopBar
          onLogoClick={() => navigate("/")}
          onCartClick={() => navigate("/cart")}
        />
      </div>

      <img src={image} alt={name} className="product-page-image-full" />

      <h2 className="product-title">{brand} {name}</h2>

      <div className="product-page-price">
        {hasDiscount ? (
          <>
            <span className="discounted">{finalPrice} BYN</span>
            <span className="original">{price} BYN</span>
          </>
        ) : (
          <span>{price} BYN</span>
        )}
      </div>

      <div className="sizes">
          <p>Выберите размер:</p>
          <div className="size-buttons">
            {availableSizes.map((size) => {
              const isDiscounted = discountSize.includes(size);
              return (
                <div className="size-wrapper" key={size}>
                  <button
                    className={`size-btn ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                  {isDiscounted && <span className="discount-badge">Скидка</span>}
                </div>
              );
            })}
          </div>
        </div>

      <button
        className="buy-btn"
        disabled={!selectedSize}
        onClick={handleAddToCartClick}
      >
        Добавить в корзину 😌
      </button>
    </div>
  );
};

export default Product;
