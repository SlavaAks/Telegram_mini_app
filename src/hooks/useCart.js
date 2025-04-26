import { useState, useEffect } from 'react';

const CART_KEY = 'cart';

const useCart = () => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = ({ id, selectedSize, finalPrice, brand, name, image }) => {
    setCart((prev) => {
      const nextId = prev.length > 0 ? prev[prev.length - 1].id_item + 1 : 1;
      const product = {
         id_item:nextId,articul:id,size:selectedSize,finalPrice,brand,model:name,image
      };
      return [...prev, product];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter(p => p.id_item !== productId));
  };

  const clearCart = () => setCart([]);

  return { cart, addToCart, removeFromCart, clearCart };
};

export default useCart;