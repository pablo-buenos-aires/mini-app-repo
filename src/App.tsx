import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
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
import useCartStore from './store/cart';

const App = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const mergeItems = useCartStore((state) => state.mergeItems);
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    const tg = getTelegramWebApp();
    if (tg) {
      tg.ready();
      if (typeof tg.expand === 'function') {
        tg.expand();
      }
    }
  }, []);

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
    const tg = getTelegramWebApp();
    if (!tg || !tg.MainButton) {
      return;
    }
    const handleClick = () => navigate('/checkout');
    tg.MainButton.onClick(handleClick);
    return () => {
      tg.MainButton.offClick(handleClick);
    };
  }, [navigate]);

  useEffect(() => {
    const tg = getTelegramWebApp();
    if (!tg || !tg.MainButton) {
      return;
    }
    if (items.length === 0) {
      tg.MainButton.hide();
      return;
    }
    tg.MainButton.setText('Оформить заказ');
    tg.MainButton.show();
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
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">TM</span>
          <div>
            <h1>Mini Shop</h1>
            <p>Telegram storefront demo</p>
          </div>
        </div>
        <nav className="nav">
          <Link to="/">Categories</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>

      <main className="page">
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
      </main>
    </div>
  );
};

export default App;
