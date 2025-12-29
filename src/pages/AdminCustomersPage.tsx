import { useEffect, useState } from 'react';
import { fetchAdminCustomers, type CustomerSummary } from '../api/orders';

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadCustomers = async () => {
      try {
        const data = await fetchAdminCustomers();
        if (active) {
          setCustomers(data);
        }
      } catch {
        if (active) {
          setError('Failed to load customers.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    loadCustomers();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Админ: Клиенты</h2>
      </div>
      {isLoading ? (
        <div className="card empty">Загружаем клиентов...</div>
      ) : error ? (
        <div className="card empty">{error}</div>
      ) : customers.length === 0 ? (
        <div className="card empty">Клиенты не найдены.</div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Имя</th>
                <th>Последний визит</th>
                <th>Заказы</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.user_id}>
                  <td>{customer.user_id}</td>
                  <td>{customer.username ?? '-'}</td>
                  <td>
                    {[customer.first_name, customer.last_name].filter(Boolean).join(' ') || '-'}
                  </td>
                  <td>{new Date(customer.last_seen_at).toLocaleString()}</td>
                  <td>{customer.orders_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminCustomersPage;
