import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { cloudStorage } from "@telegram-apps/sdk";
import "./Product.css";
import TopBar from "../components/TopBar";
import { useCart } from "../context/CartContext";
import SizeChartModal from "../components/SizeChartModal";
import placeholder from "../assets/placeholder.png";

const CACHE_KEY = "cachedImages";

const getCachedImages = () => {
  const cached = cloudStorage.getItem(CACHE_KEY);
  return cached ? JSON.parse(cached) : {};
};

const saveCachedImages = (cache) => {
  cloudStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

const preloadAndCacheImage = async (src) => {
  if (!cloudStorage.isSupported()) return src;
  const cache = getCachedImages();
  if (cache[src]) return cache[src];
  try {
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });
    cache[src] = src;
    saveCachedImages(cache);
    return src;
  } catch {
    return null;
  }
};

const Product = ({ product: propProduct }) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const dragContainerRef = useRef(null);
  const productId = pathname.split("/").pop();
  const WebApp = window.Telegram?.WebApp;
  const [product, setProduct] = useState(propProduct || null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [imgSrc, setImgSrc] = useState(placeholder);

  useEffect(() => {
    if (!state) {
      const products = JSON.parse(localStorage.getItem("products")) || [];
      const foundProduct = products.find(
        (p) => p.id === productId || p.articul === productId
      );
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        navigate("/");
      }
    } else {
      setProduct(state.product);
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

  useEffect(() => {
    if (product?.image?.[currentImageIndex]) {
      preloadAndCacheImage(product.image[currentImageIndex]).then((cached) => {
        // window?.Telegram?.WebApp?.showAlert(cached);
        setImgSrc(cached || placeholder);
      });
    }
  }, [product, currentImageIndex]);

  if (!product) {

    return (
      <div className="product-page">
        <div className="top-bar-wrapper">
          <TopBar onLogoClick={() => navigate("/")} onCartClick={() => navigate("/cart")} />
        </div><p>Товар не найден</p>
      </div>
    )
  }


  const {
    id, brand, name, image, colors = [], availableSizes, price,
    discountSize = [], discount, category, telegramLink, madein, material
  } = product;

  const selectedColor = colors[currentImageIndex] || null;
  const hasDiscount = selectedSize && discountSize.includes(selectedSize);
  const finalPrice = hasDiscount && discount ? Math.round(price - (price * discount) / 100) : price;

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setIsAdded(false);
  };

  const handleAddToCart = () => {
    addToCart({ id, selectedSize, finalPrice, brand, name, image: image[currentImageIndex], color: selectedColor });
    setIsAdded(true);
  };

  const swipeConfidenceThreshold = 3000;
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

  const botUsername = "Lawka_by_bot";
  const shareUrl = `https://t.me/${botUsername}/shop?startapp=${id}`;
  const shareText = `Посмотри, что нашёл: ${brand} ${name}`;
  const telegramShareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <div className="product-page">
      <div className="top-bar-wrapper">
        <TopBar onLogoClick={() => navigate("/")} onCartClick={() => navigate("/cart")} />
      </div>
      <div className="image-slider">
        <AnimatePresence initial={false} custom={direction}>
          <div ref={dragContainerRef} className="drag-container">
            <motion.img
              key={currentImageIndex}
              src={imgSrc}
              alt={`${name}-${currentImageIndex}`}
              className="product-page-image-full"
              custom={direction}
              style={{ x, opacity, transition: "0.125s transform", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)" }}
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={dragContainerRef}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) changeImage(currentImageIndex + 1);
                else if (swipe > swipeConfidenceThreshold) changeImage(currentImageIndex - 1);
              }}
              onError={() => setImgSrc(placeholder)}
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
      <div className="dicription-field">
        <p className="product-title">{brand} {name}</p>

        <div className="price-color">
          {selectedColor && (
            <p className="product-color">Цвет: <b>{selectedColor}</b></p>
          )}
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
        </div>

        <div className="product-page-price-tglink">

          {telegramLink && (
            <div className="telegram-link">
              <div className="link-row">
                <a
                  href={telegramShareLink}
                  className="share-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Поделиться ➦
                </a>
                <a
                  href={telegramLink}
                  className="channel-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Посмотреть пост в канале
                </a>
              </div>
              <p className="offer-text">+ За подписку на канал 2 пары носков в подарок</p>
            </div>
          )}
        </div>
        <div className='product-description'>
          <p className="description-madein">Производитель: {madein}</p>
          <p className='material'>Описание: {material}</p>
          <div className="delivary-date">
            Срок доставки: <span className="delivery-badge">2–5 дней</span>
          </div>

        </div>
      </div>

      <div className="sizes">
        <div className="titel-table-btn">
          <p>Выберите размер:</p>
          {category==='shoes'&&
          <button className="toggle-size-chart-btn" onClick={() => setShowSizeChart(true)}>
            Таблица размеров
          </button>}
        </div>
        {showSizeChart && <SizeChartModal onClose={() => setShowSizeChart(false)} />}
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