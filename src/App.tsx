import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import CategoriesPage from './pages/CategoriesPage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminCustomersPage from './pages/AdminCustomersPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminProductsPage from './pages/AdminProductsPage';
import NotFoundPage from './pages/NotFoundPage';
import { fetchCart, syncCart } from './api/cart';
import { getTelegramWebApp } from './lib/telegram';
import Layout from './components/Layout';
import useCartStore from './store/cart';

const App = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const mergeItems = useCartStore((state) => state.mergeItems);
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    let active = true;
    const loadCart = async () => {
      try {
        const serverItems = await fetchCart();
        if (active) {
          mergeItems(serverItems);
        }
      } catch {
        // ignore initial sync errors
      } finally {
        if (active) {
          setCartReady(true);
        }
      }
    };

    loadCart();
    return () => {
      active = false;
    };
  }, [mergeItems]); 

  useEffect(() => {
    const mainButton = getTelegramWebApp()?.MainButton;
    if (!mainButton) {
      return;
    }
    const handleClick = () => navigate('/checkout');
    mainButton.onClick(handleClick);
    return () => {
      mainButton.offClick(handleClick);
    };
  }, [navigate]);

  useEffect(() => {
    const mainButton = getTelegramWebApp()?.MainButton;
    if (!mainButton) {
      return;
    }
    if (items.length === 0) {
      mainButton.hide();
      return;
    }
    mainButton.setText('Оформить заказ');
    mainButton.show();
  }, [items.length]);

  useEffect(() => {
    if (!cartReady) {
      return;
    }
    const timer = window.setTimeout(() => {
      syncCart(items).catch(() => {
        // ignore background sync errors
      });
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [cartReady, items]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CategoriesPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/customers" element={<AdminCustomersPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
