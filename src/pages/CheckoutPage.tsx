import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders';
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
    <section>
      <div className="section-head">
        <h2>Checkout</h2>
        <Link className="link" to="/cart">Back to cart</Link>
      </div>

      {items.length === 0 ? (
        <div className="card empty">Cart is empty. Add items before checkout.</div>
      ) : (
        <form className="card stack" onSubmit={handleSubmit}>
          <label>
            Phone
            <input
              type="tel"
              placeholder="+1 555 0123"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </label>
          <label>
            Delivery address
            <input
              type="text"
              placeholder="Street, building, apt"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </label>
          <label>
            Comment
            <textarea
              rows={3}
              placeholder="Any special notes?"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>
          {error ? <div className="pill">{error}</div> : null}
          <div className="row">
            <strong>Total ${(totalCents / 100).toFixed(2)}</strong>
            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Confirm order'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default CheckoutPage;
