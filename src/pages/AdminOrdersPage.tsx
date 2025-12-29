import { FormEvent, useEffect, useState } from 'react';
import { fetchAdminOrders, type Order } from '../api/orders';

const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const loadOrders = async (params?: { status?: string; from?: string; to?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAdminOrders(params);
      setOrders(data);
    } catch {
      setError('Failed to load orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    loadOrders({
      status: status.trim() || undefined,
      from: from.trim() || undefined,
      to: to.trim() || undefined
    });
  };

  return (
    <section>
      <div className="section-head">
        <h2>Admin Orders</h2>
      </div>
      <form className="card row" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="status (pending)"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        />
        <input
          type="text"
          placeholder="from (RFC3339)"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
        />
        <input
          type="text"
          placeholder="to (RFC3339)"
          value={to}
          onChange={(event) => setTo(event.target.value)}
        />
        <button className="btn" type="submit">Filter</button>
      </form>
      {isLoading ? (
        <div className="card empty">Loading orders...</div>
      ) : error ? (
        <div className="card empty">{error}</div>
      ) : orders.length === 0 ? (
        <div className="card empty">No orders found.</div>
      ) : (
        <div className="stack">
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div className="row">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p>User: {order.user_id}</p>
                  <p>Status: {order.status}</p>
                  <p>{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <strong>{formatMoney(order.total_cents)}</strong>
              </div>
              <div className="stack">
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.product_id}`} className="row">
                    <span>
                      {item.title} x {item.qty}
                    </span>
                    <span>{formatMoney(item.subtotal_cents)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminOrdersPage;
