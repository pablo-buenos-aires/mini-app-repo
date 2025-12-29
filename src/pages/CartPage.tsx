import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTelegramWebApp } from '../lib/telegram';
import useCartStore from '../store/cart';

const CartPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const totalCents = useCartStore((state) => state.totalCents());
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const showWebCheckout = useMemo(() => !getTelegramWebApp(), []);

  return (
    <section>
      <div className="section-head">
        <h2>Your cart</h2>
        <button className="link" type="button" onClick={clear}>
          Clear
        </button>
      </div>

      {items.length === 0 ? (
        <div className="card empty">Cart is empty.</div>
      ) : (
        <div className="stack">
          {items.map((item) => (
            <div key={item.product_id} className="card row">
              <div>
                <h3>{item.title}</h3>
                <p>
                  ${(item.price_cents / 100).toFixed(2)} x {item.qty}
                </p>
                <small>${(item.subtotal_cents / 100).toFixed(2)}</small>
              </div>
              <div className="row">
                <button className="btn ghost" type="button" onClick={() => decrement(item.product_id)}>
                  -
                </button>
                <button className="btn ghost" type="button" onClick={() => increment(item.product_id)}>
                  +
                </button>
                <button className="btn ghost" type="button" onClick={() => removeItem(item.product_id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="card total">
            <span>Total</span>
            <strong>${(totalCents / 100).toFixed(2)}</strong>
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
