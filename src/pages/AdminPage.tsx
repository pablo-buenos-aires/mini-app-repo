import { Link } from 'react-router-dom';

const AdminPage = () => {
  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Админ</h2>
      </div>
      <div className="stack">
        <Link className="card card-body" to="/admin/orders">
          Управление заказами
        </Link>
        <Link className="card card-body" to="/admin/customers">
          Клиенты
        </Link>
        <Link className="card card-body" to="/admin/categories">
          Категории
        </Link>
        <Link className="card card-body" to="/admin/products">
          Товары
        </Link>
      </div>
    </section>
  );
};

export default AdminPage;
