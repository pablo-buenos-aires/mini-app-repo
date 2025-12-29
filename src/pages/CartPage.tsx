import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import QtyControl from '../components/QtyControl';
import { formatMoney } from '../lib/money';
import { getTelegramWebApp } from '../lib/telegram';
import useCartStore from '../store/cart';

const CartPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const totalCents = useCartStore((state) => state.totalCents());
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const clear = useCartStore((state) => state.clear);
  const showWebCheckout = useMemo(() => !getTelegramWebApp(), []);

  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Корзина</h2>
        <button className="btn ghost" type="button" onClick={clear}>
          Очистить
        </button>
      </div>

      {items.length === 0 ? (
        <div className="card empty">Корзина пустая.</div>
      ) : (
        <div className="stack">
          {items.map((item) => (
            <div key={item.product_id} className="card cart-item">
              <div className="cart-meta">
                <h3>{item.title}</h3>
                <p>{formatMoney(item.price_cents, 'ARS')} · {item.qty} шт.</p>
              </div>
              <QtyControl
                qty={item.qty}
                onIncrement={() => increment(item.product_id)}
                onDecrement={() => decrement(item.product_id)}
              />
            </div>
          ))}
          <div className="card cart-summary">
            <span>Итого</span>
            <strong>{formatMoney(totalCents, 'ARS')}</strong>
          </div>
          {showWebCheckout ? (
            <div className="row">
              <button className="btn" type="button" onClick={() => navigate('/checkout')}>
                Оформить заказ
              </button>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
};

export default CartPage;
