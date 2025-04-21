import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import { initTelegram } from './telegram';

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initTelegram();
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) return <p className="p-6">Загрузка данных...</p>;

  return (

    <Router>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/checkout" element={<Checkout />}/>
      </Routes>
    </Router>
  );
};

export default App;
