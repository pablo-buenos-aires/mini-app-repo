import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders';
import { formatMoney } from '../lib/money';
import useCartStore from '../store/cart';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const totalCents = useCartStore((state) => state.totalCents());
  const clear = useCartStore((state) => state.clear);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (items.length === 0 || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await createOrder({
        contact_phone: phone,
        delivery_address: address,
        comment
      });
      clear();
      navigate('/orders');
    } catch {
      setError('Failed to create order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Оформление</h2>
      </div>

      {items.length === 0 ? (
        <div className="card empty">Корзина пустая. Добавьте товары.</div>
      ) : (
        <form className="card stack" onSubmit={handleSubmit}>
          <label>
            Телефон
            <input
              type="tel"
              placeholder="+7 900 000 00 00"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </label>
          <label>
            Адрес доставки
            <input
              type="text"
              placeholder="Улица, дом, квартира"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </label>
          <label>
            Комментарий
            <textarea
              rows={3}
              placeholder="Комментарий к заказу"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>
          {error ? <div className="pill">{error}</div> : null}
          <div className="row">
            <strong>{formatMoney(totalCents, 'ARS')}</strong>
            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Отправка...' : 'Подтвердить'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default CheckoutPage;
