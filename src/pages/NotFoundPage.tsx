import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Страница не найдена</h2>
      </div>
      <div className="card empty">
        <p>Такой страницы нет.</p>
        <Link className="link" to="/">На главную</Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
