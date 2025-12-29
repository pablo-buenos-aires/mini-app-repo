import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchProduct } from '../api/products';
import ProductCard from '../components/ProductCard';
import useCartStore from '../store/cart';

const ProductPage = () => {
  const params = useParams();
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);

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

  const qty = useMemo(() => {
    if (!product) {
      return 0;
    }
    const match = items.find((item) => item.product_id === product.id);
    return match?.qty ?? 0;
  }, [items, product]);

  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">{product?.title ?? 'Товар'}</h2>
      </div>

      {!isValidId ? (
        <div className="card empty">Некорректный товар.</div>
      ) : isLoading ? (
        <div className="card empty">Загружаем товар...</div>
      ) : isError || !product ? (
        <div className="card empty">Не удалось загрузить товар.</div>
      ) : (
        <ProductCard
          product={product}
          qty={qty}
          onAdd={() =>
            addItem(
              {
                product_id: product.id,
                title: product.title,
                price_cents: product.price_cents
              },
              1
            )
          }
          onIncrement={() => increment(product.id)}
          onDecrement={() => decrement(product.id)}
        />
      )}
    </section>
  );
};

export default ProductPage;
