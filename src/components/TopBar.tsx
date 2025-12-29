import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cart';
import { formatMoney } from '../lib/money';

const resolveTitle = (pathname: string) => {
  if (pathname.startsWith('/category')) {
    return 'Категория';
  }
  if (pathname.startsWith('/product')) {
    return 'Товар';
  }
  if (pathname.startsWith('/cart')) {
    return 'Корзина';
  }
  if (pathname.startsWith('/checkout')) {
    return 'Оформление';
  }
  if (pathname.startsWith('/orders')) {
    return 'Заказы';
  }
  if (pathname.startsWith('/admin/orders')) {
    return 'Админ: Заказы';
  }
  if (pathname.startsWith('/admin/customers')) {
    return 'Админ: Клиенты';
  }
  if (pathname.startsWith('/admin/categories')) {
    return 'Админ: Категории';
  }
  if (pathname.startsWith('/admin/products')) {
    return 'Админ: Товары';
  }
  if (pathname.startsWith('/admin')) {
    return 'Админ';
  }
  return 'Mushroom Shop';
};

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = useCartStore((state) => state.items);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );
  const totalCents = useMemo(
    () => items.reduce((sum, item) => sum + item.subtotal_cents, 0),
    [items]
  );

  const title = useMemo(() => resolveTitle(location.pathname), [location.pathname]);
  const showBack = location.pathname !== '/' && window.history.length > 1;

  return (
    <div className="topbar">
      <div className="topbar-back">
        {showBack ? (
          <button className="btn ghost" type="button" onClick={() => navigate(-1)}>
            Назад
          </button>
        ) : null}
      </div>
      <div className="topbar-title">{title}</div>
      <button className="topbar-cart" type="button" onClick={() => navigate('/cart')}>
        Корзина: {totalItems} · {formatMoney(totalCents, 'ARS')}
      </button>
    </div>
  );
};

export default TopBar;
