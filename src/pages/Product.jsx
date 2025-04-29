import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Product.css";
import TopBar from "../components/TopBar";
import { useCart } from "../context/CartContext";

const Product = ({ product: propProduct }) => {
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const imageSliderRef = useRef(null); // реф для контейнера изображения
  const dragContainerRef = useRef(null);
  const productId = pathname.split("/").pop();
  const WebApp = window.Telegram?.WebApp;
  const [product, setProduct] = useState(propProduct || null);
  // Если propProduct не передан, ищем товар в локальной памяти по id или articul
  useEffect(() => {
    if (!state) {
      const products = JSON.parse(localStorage.getItem("products")) || []; // получаем все товары из локальной памяти

      const foundProduct = products.find(
        (p) => p.id === productId || p.articul === productId
      );

      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        navigate("/"); // если товар не найден, возвращаем на главную
      }
    }
    else {
      setProduct(state.product)
    }
  }, [productId, propProduct, navigate]);

  useEffect(() => {
    if (WebApp?.BackButton) {
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(() => navigate(-1));
      return () => {
        WebApp.BackButton.hide();
        WebApp.BackButton.offClick();
      };
    }
  }, [navigate, WebApp]);

  if (!product) {
    return <p>Товар не найден</p>;
  }

  const {
    id,
    brand,
    name,
    image,
    colors = [],
    availableSizes,
    price,
    discountSize = [],
    discount,
    category,
    telegramLink
  } = product;

  const selectedColor = colors[currentImageIndex] || null;

  const hasDiscount = selectedSize && discountSize.includes(selectedSize);
  const finalPrice =
    hasDiscount && discount ? Math.round(price - (price * discount) / 100) : price;

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setIsAdded(false);
  };

  const handleAddToCart = () => {
    addToCart({
      id,
      selectedSize,
      finalPrice,
      brand,
      name,
      image: image[currentImageIndex],
      color: selectedColor,
    });
    setIsAdded(true);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  const changeImage = (newIndex) => {
    const total = image.length;
    const nextIndex = (newIndex + total) % total;
    setDirection(nextIndex > currentImageIndex ? 1 : -1);
    setCurrentImageIndex(nextIndex);
  };

  const handleColorSelect = (index) => {
    setDirection(index > currentImageIndex ? 1 : -1);
    setCurrentImageIndex(index);
  };
  const getDragConstraints = () => {
    if (imageSliderRef.current) {
      const sliderWidth = imageSliderRef.current.offsetWidth;
      return { left: -sliderWidth, right: sliderWidth };
    }
    return { left: 0, right: 0 };
  };

  return (
    <div className="product-page">
      <div className="top-bar-wrapper">
        <TopBar onLogoClick={() => navigate("/")} onCartClick={() => navigate("/cart")} />
      </div>

      <div className="image-slider" ref={imageSliderRef}>
        <AnimatePresence initial={false} custom={direction}>
          <div ref={dragContainerRef} className="drag-container">
            <motion.img
              key={currentImageIndex}
              src={image[currentImageIndex]}
              alt={`${name}-${currentImageIndex}`}
              className="product-page-image-full"
              custom={direction}
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              drag="x"
              dragConstraints={dragContainerRef}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  changeImage(currentImageIndex + 1);
                } else if (swipe > swipeConfidenceThreshold) {
                  changeImage(currentImageIndex - 1);
                }
              }}
            />
          </div>
        </AnimatePresence>

        <div className="image-nav">
          {image.map((_, index) => (
            <button
              key={index}
              className={`image-dot ${index === currentImageIndex ? "active" : ""}`}
              onClick={() => handleColorSelect(index)}
            />
          ))}
        </div>
      </div>

      {colors.length > 0 && (
        <div className="color-selector">
          <div className="color-label-and-buttons">
            <div className="color-label">Выберите цвет:</div>
            <div className="color-buttons">
              {colors.map((color, index) => (
                <button
                  key={color}
                  className={`color-btn ${index === currentImageIndex ? "active" : ""}`}
                  onClick={() => handleColorSelect(index)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <h2 className="product-title">{brand} {name}</h2>

      {selectedColor && (
        <p className="product-color">Цвет: <b>{selectedColor}</b></p>
      )}

      <div className="product-page-price-tglink">
        <div className="price">
          {hasDiscount ? (
            <>
              <span className="discounted">{finalPrice} BYN</span>
              <span className="original">{price} BYN</span>
            </>
          ) : (
            <span>{price} BYN</span>
          )}
        </div>

        {telegramLink && (
          <div className="telegram-link">
            <p className="offer-text">+ За подписку на канал 2 пары носков в подарок</p>
            <a href={telegramLink} target="_blank" rel="noopener noreferrer">
              📢 Посмотреть пост
            </a>
          </div>
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
                  onClick={() => handleSizeSelect(size)}
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
        className={`buy-btn ${isAdded ? "added" : ""}`}
        disabled={!selectedSize}
        onClick={isAdded ? () => navigate("/cart") : handleAddToCart}
      >
        {isAdded ? "Перейти в корзину 🛒" : "Добавить в корзину 😌"}
      </button>
    </div>
  );
};

export default Product;
