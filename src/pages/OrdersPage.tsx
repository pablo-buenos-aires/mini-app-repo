import { useEffect, useState } from 'react';
import { fetchMyOrders, type Order } from '../api/orders';

const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadOrders = async () => {
      try {
        const data = await fetchMyOrders();
        if (active) {
          setOrders(data);
        }
      } catch {
        if (active) {
          setError('Failed to load orders.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section>
      <div className="section-head">
        <h2>Orders</h2>
      </div>
      {isLoading ? (
        <div className="card empty">Loading orders...</div>
      ) : error ? (
        <div className="card empty">{error}</div>
      ) : orders.length === 0 ? (
        <div className="card empty">No orders yet.</div>
      ) : (
        <div className="stack">
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div className="row">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p>Status: {order.status}</p>
                  <p>{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <strong>{formatMoney(order.total_cents)}</strong>
              </div>
              {order.items.length === 0 ? (
                <p>No items.</p>
              ) : (
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
              )}
              {order.contact_phone ? <p>Phone: {order.contact_phone}</p> : null}
              {order.delivery_address ? <p>Address: {order.delivery_address}</p> : null}
              {order.comment ? <p>Comment: {order.comment}</p> : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default OrdersPage;
