import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import ProductCard from '../components/ProductCard';
import useLocalStorage from '../hooks/useLocalStorage';  // Хук для localStorag
import useSSE from '../hooks/useSSE'
import request from '../utils/api.ts';
import './Catalog.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useTelegramViewport } from '../hooks/useTelegramViewport';

const Catalog = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useLocalStorage('products', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [discountOnly, setDiscountOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modelFilter, setModelFilter] = useState('all');
  const viewportHeight = useTelegramViewport();
  window.Telegram?.WebApp.disableVerticalSwipes();

  const fetchProducts = async () => {
    try {
      const response = await request('catalog');
      const rawData = response.data;



      const parsed = rawData.map((item) => ({
        id: item[0],
        brand: item[1] || '',
        name: item[2] ? String(item[2]) : '',
        image: item[3],
        availableSizes: item[4].split(','),
        price: parseInt(item[5].replace(/\D/g, ''), 10),
        discountSize: item[6] !== null ? item[6].split(',') : [],
        discount: item[7] !== null ? parseInt(item[7].replace('%', '')) : false,
        category: item[8],
      }));

      setProducts(parsed);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error);
    }
  };

  // Инициализируем SSE-подписку
  useSSE(fetchProducts);

  // Загружаем при первом рендере, если данных нет
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts(); // Загружаем продукты только при пустом списке
    } else {
      setLoading(false); // Если данные уже загружены, убираем состояние загрузки
    }
  }, [products]); // Этот эффект срабатывает только при изменении состояния продуктов

  useEffect(() => {
    setBrandFilter('all')
    setModelFilter('all')
    setSizeFilter('all')
  }, [categoryFilter,]); // Зависимости для изменения фильтров

  const availableBrands = Array.from(
    new Set(
      products
        .filter(p => categoryFilter === 'all' || p.category === categoryFilter)
        .map(p => p.brand)
    )
  );
  const availableModels = brandFilter !== 'all'
    ? Array.from(new Set(products
      .filter(p => p.brand === brandFilter && (p.category === categoryFilter || categoryFilter === 'all'))
      .map(p => p.name))) : [];

  const filteredProducts = products.filter(product => {
    if (
      searchQuery &&
      !`${product.brand || ''} ${product.name || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
    ) return false;


    if (categoryFilter !== 'all' && product.category !== categoryFilter) return false;
    if (brandFilter !== 'all' && product.brand !== brandFilter) return false;
    if (modelFilter !== 'all' && product.name !== modelFilter) return false;
    if (
      sizeFilter !== 'all' &&
      !product.availableSizes.includes(sizeFilter)
    ) return false;
    if (discountOnly && !product.discount) return false;
    return true;
  });

  const handleClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const shoesSize = Array.from({ length: 7 }, (_, i) => (40 + i).toString())
  const clothesSize = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  const allSizes =
    categoryFilter === 'shoes'
      ? shoesSize
      : categoryFilter === 'clothes'
        ? clothesSize
        : [...clothesSize, ...shoesSize];


  const categoryLabels = {
    shoes: 'Обувь',
    clothes: 'Одежда',
  };
  const allCategory = ["shoes", "clothes"]

  return (
    <section className="section-page" style={{ height: viewportHeight }}>
      <div className="sticky-header">
        <TopBar
          onLogoClick={() => navigate('/')}
          onCartClick={() => navigate('/cart')}
        />
      </div>

      <div className="div-input">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Можно найти нужную модель ..."
          className="text-field"
        />
      </div>

      <div className="div-filter">
        <div className="filter-item">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="select-item"
          >
            <option value="all">Все категории</option>
            {allCategory.map(category => (
              <option key={category} value={category}>
                {categoryLabels[category] || category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <select
            value={brandFilter}
            onChange={e => setBrandFilter(e.target.value)}
            className="select-brand"
          >
            <option value="all">Все бренды</option>
            {availableBrands.map(brand => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {brandFilter !== 'all' && (
          <div className="filter-item">
            <select
              value={modelFilter}
              onChange={e => setModelFilter(e.target.value)}
              className="select-brand"
            >
              <option value="all">Все модели</option>
              {availableModels.map(model => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="filter-item">
          <button
            className={`discount-button ${discountOnly ? 'active' : ''}`}
            onClick={() => setDiscountOnly(prev => !prev)}
          >
            {discountOnly ? 'Все товары' : 'Со скидкой'}
          </button>
        </div>

        <div className="filter-item">
          <button
            className={`allsize-button ${sizeFilter !== 'all' ? '' : 'active'}`}
            onClick={() => setSizeFilter('all')}
          >
            Все размеры
          </button>
        </div>
      </div>

      {/* Сюда отдельно список кнопок размеров */}
      <div className="size-buttons">
        {allSizes.map(size => (
          <button
            key={size}
            className={`size-button ${sizeFilter === size ? 'selected' : ''}`}
            onClick={() => setSizeFilter(sizeFilter === size ? 'all' : size)}
          >
            {size}
          </button>
        ))}
      </div>
      <div className="product-list">
        {loading ? (
          <p>Загрузка товаров...</p>
        ) : filteredProducts.length > 0 ? (
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                style={{ width: '100%' }} // добавляем ширину!
              >
                <ProductCard
                  {...product}
                  onClick={() => handleClick(product)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <p>Ничего не нашлось</p>
        )}
      </div>
    </section>
  );
};

export default Catalog;
