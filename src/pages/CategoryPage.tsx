import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { fetchCategories } from '../api/categories';
import { fetchProducts } from '../api/products';

const CategoryPage = () => {
  const params = useParams();
  const categoryId = Number(params.id);
  const isValidId = Number.isFinite(categoryId) && categoryId > 0;

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  const {
    data: products = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: () => fetchProducts({ categoryId }),
    enabled: isValidId
  });

  const categoryName = useMemo(() => {
    const match = categories.find((category) => category.id === categoryId);
    return match?.name ?? `Category ${params.id ?? ''}`;
  }, [categories, categoryId, params.id]);

  const visibleProducts = useMemo(
    () => products.filter((product) => product.active),
    [products]
  );

  return (
    <section>
      <div className="section-head">
        <h2>{categoryName}</h2>
        <Link className="link" to="/">Back to categories</Link>
      </div>

      <div className="grid">
        {!isValidId ? (
          <div className="card empty">Invalid category.</div>
        ) : isLoading ? (
          <div className="card empty">Loading products...</div>
        ) : isError ? (
          <div className="card empty">Failed to load products.</div>
        ) : visibleProducts.length === 0 ? (
          <div className="card empty">No products yet.</div>
        ) : (
          visibleProducts.map((product) => (
            <Link key={product.id} className="card" to={`/product/${product.id}`}>
              <h3>{product.title}</h3>
              <p>${(product.price_cents / 100).toFixed(2)}</p>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default CategoryPage;
