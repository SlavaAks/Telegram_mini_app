import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';

const initialProducts = [
  { id: 1, name: 'Nike Air Max', category: 'shoes', brand: 'Nike', size: '42', discount: true },
  { id: 2, name: 'Adidas UltraBoost', category: 'shoes', brand: 'Adidas', size: '41', discount: false },
  { id: 3, name: 'Puma RS-X', category: 'shoes', brand: 'Puma', size: '42', discount: true },
  { id: 4, name: "Levi's Jeans", category: 'clothes', brand: "Levi's", size: 'L', discount: false },
  { id: 5, name: 'Zara T-shirt', category: 'clothes', brand: 'Zara', size: 'M', discount: true }
];

const Catalog = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [discountOnly, setDiscountOnly] = useState(false);



  const availableBrands = Array.from(new Set(initialProducts.map(p => p.brand)));
  const availableSizes = Array.from(new Set(initialProducts.map(p => p.size)));

  const filteredProducts = initialProducts.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (categoryFilter !== 'all' && product.category !== categoryFilter) return false;
    if (brandFilter !== 'all' && product.brand !== brandFilter) return false;
    if (sizeFilter !== 'all' && product.size !== sizeFilter) return false;
    if (discountOnly && !product.discount) return false;
    return true;
  });

  return (
    <div className="">
      <TopBar
        onLogoClick={() => navigate('/')}
        onCartClick={() => navigate('/cart')}
      />

      {/* Фильтры */}
      <div className="">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Поиск модели"
          className=""
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className=""
        >
          <option value="all">Все категории</option>
          <option value="clothes">Одежда</option>
          <option value="shoes">Обувь</option>
        </select>
        <select
          value={brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
          className=""
        >
          <option value="all">Все бренды</option>
          {availableBrands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
        <select
          value={sizeFilter}
          onChange={e => setSizeFilter(e.target.value)}
          className=""
        >
          <option value="all">Все размеры</option>
          {availableSizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <label className="">
          <input
            type="checkbox"
            checked={discountOnly}
            onChange={e => setDiscountOnly(e.target.checked)}
            className=""
          />
          <span>Только со скидкой</span>
        </label>
      </div>

      {/* Список товаров */}
      <div className="">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="">
              <h3 className="">{product.name}</h3>
              <p className="">Категория: {product.category === 'shoes' ? 'Обувь' : 'Одежда'}</p>
              <p className="">Бренд: {product.brand}</p>
              <p className="">Размер: {product.size}</p>
              {product.discount && <p className="">Со скидкой!</p>}
            </div>
          ))
        ) : (
          <p>Нет товаров, соответствующих фильтрам.</p>
        )}
      </div>
    </div>
  );
};

export default Catalog;
