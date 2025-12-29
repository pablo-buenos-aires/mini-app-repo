import { Link } from 'react-router-dom';

const AdminPage = () => {
  return (
    <section>
      <div className="section-head">
        <h2>Admin</h2>
      </div>
      <div className="stack">
        <Link className="card" to="/admin/orders">
          Manage orders
        </Link>
        <Link className="card" to="/admin/customers">
          View customers
        </Link>
        <Link className="card" to="/admin/categories">
          Manage categories
        </Link>
        <Link className="card" to="/admin/products">
          Manage products
        </Link>
      </div>
    </section>
  );
};

export default AdminPage;
