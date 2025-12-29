import { Link } from 'react-router-dom';
import type { Product } from '../api/products';
import { formatMoney } from '../lib/money';
import QtyControl from './QtyControl';

type ProductCardProps = {
  product: Product;
  qty: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  detailHref?: string;
};

const ProductCard = ({
  product,
  qty,
  onAdd,
  onIncrement,
  onDecrement,
  detailHref
}: ProductCardProps) => {
  const showControl = qty > 0;
  const hasLink = Boolean(detailHref);

  const media = product.photo_url ? (
    <img src={product.photo_url} alt={product.title} />
  ) : (
    <span className="product-placeholder">Нет фото</span>
  );

  const mediaNode = hasLink ? (
    <Link to={detailHref ?? ''} className="product-media">
      {media}
    </Link>
  ) : (
    <div className="product-media">{media}</div>
  );

  return (
    <div className="card product-card">
      {mediaNode}
      <div className="product-body">
        <div className="row">
          <h3 className="product-title">{product.title}</h3>
          {hasLink ? (
            <Link className="link" to={detailHref ?? ''}>
              Подробнее
            </Link>
          ) : null}
        </div>
        <p className="product-desc">{product.description ?? 'Без описания.'}</p>
        <div className="product-footer">
          <span className="price">{formatMoney(product.price_cents, product.currency)}</span>
          {!product.active ? (
            <span className="pill">Нет в наличии</span>
          ) : showControl ? (
            <QtyControl qty={qty} onIncrement={onIncrement} onDecrement={onDecrement} />
          ) : (
            <button className="btn" type="button" onClick={onAdd}>
              Добавить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
