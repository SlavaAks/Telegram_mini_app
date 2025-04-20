import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query'; 
import App from './App';
import './index.css';
import { CartProvider } from './context/CartContext';

// Переименовываем переменную, чтобы не конфликтовала с импортом
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <App />
      </CartProvider>  
    </QueryClientProvider>
  </React.StrictMode>
);
