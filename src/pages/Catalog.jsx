import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import ProductCard from '../components/ProductCard';
import './Catalog.css';


const initialProducts = [
  {
    id: 1,
    name: 'Nike Air Max',
    category: 'shoes',
    brand: 'Nike',
    size: '42',
    price: 12000,
    discount: 20,
    image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/1c72d126-6b45-4a67-b992-b5f99e4a8edb/air-max-90-shoes.png',
  },
  {
    id: 2,
    name: 'Adidas UltraBoost',
    category: 'shoes',
    brand: 'Adidas',
    size: '41',
    price: 14000,
    discount: 0,
    image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/4ed79f9b23cb4f0bb289afc600d80249_9366/Ultraboost_Light_Shoes_White_HQ6352_01_standard.jpg',
  },
  {
    id: 3,
    name: 'Puma RS-X',
    category: 'shoes',
    brand: 'Puma',
    size: '42',
    price: 9000,
    discount: 10,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/388883/01/sv01/fnd/IND/fmt/png/PUMA-RS-X-Shoes',
  },
  {
    id: 4,
    name: "Levi's Jeans",
    category: 'clothes',
    brand: "Levi's",
    size: 'L',
    price: 7000,
    discount: 0,
    image: 'https://lsco.scene7.com/is/image/lsco/005010216-front-pdp.jpg',
  },
  {
    id: 5,
    name: 'Zara T-shirt',
    category: 'clothes',
    brand: 'Zara',
    size: 'M',
    price: 2500,
    discount: 15,
    image: 'https://static.zara.net/photos///2023/V/0/2/p/5645/443/250/2/w/850/5645443250_6_1_1.jpg',
  },
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
    <section className="section-page">
      <TopBar
        onLogoClick={() => navigate('/')}
        onCartClick={() => navigate('/cart')}
      />

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
        <div className='filter-item'>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="select-item"
          >
            <option value="all">Все категории</option>
            <option value="clothes">Одежда</option>
            <option value="shoes">Обувь</option>
          </select>
          </div>
        <div className='filter-item'>
          <select
            value={brandFilter}
            onChange={e => setBrandFilter(e.target.value)}
            className="select-brand"
          >
            <option value="all">Все бренды</option>
            {availableBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        <div className='filter-item'>
          <select
            value={sizeFilter}
            onChange={e => setSizeFilter(e.target.value)}
            className="select-size"
          >
            <option value="all">Все размеры</option>
            {availableSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className='filter-item'>
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
      </div>
      {/* Список товаров */}
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              image={product.image}
              model={product.name}
              price={product.price}
              discount={product.discount}
              onClick={() => navigate(`/product/${product.id}`)}
            />
          ))
        ) : (
          <p>Нет товаров, соответствующих фильтрам.</p>
        )}
      </div>
    </section>
  );
};

export default Catalog;
