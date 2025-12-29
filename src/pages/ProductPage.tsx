import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { fetchProduct } from '../api/products';
import useCartStore from '../store/cart';

const ProductPage = () => {
  const params = useParams();
  const addItem = useCartStore((state) => state.addItem);

  const productId = Number(params.id);
  const isValidId = Number.isFinite(productId) && productId > 0;
  const {
    data: product,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
    enabled: isValidId
  });

  const handleAdd = () => {
    if (!product) {
      return;
    }
    addItem({
      product_id: product.id,
      title: product.title,
      price_cents: product.price_cents
    }, 1);
  };

  return (
    <section>
      <div className="section-head">
        <h2>{product?.title ?? 'Product'}</h2>
        <Link className="link" to="/cart">Go to cart</Link>
      </div>

      {!isValidId ? (
        <div className="card empty">Invalid product.</div>
      ) : isLoading ? (
        <div className="card empty">Loading product...</div>
      ) : isError || !product ? (
        <div className="card empty">Failed to load product.</div>
      ) : (
        <div className="card detail">
          <p>{product.description ?? 'No description yet.'}</p>
          <div className="row">
            <span className="price">${(product.price_cents / 100).toFixed(2)}</span>
            <button
              className="btn"
              type="button"
              onClick={handleAdd}
              disabled={!product.active}
            >
              {product.active ? 'Add to cart' : 'Unavailable'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductPage;
