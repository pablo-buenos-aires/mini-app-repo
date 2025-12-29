import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section>
      <div className="section-head">
        <h2>Page not found</h2>
      </div>
      <div className="card empty">
        <p>We could not find that route.</p>
        <Link className="link" to="/">Go back home</Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
