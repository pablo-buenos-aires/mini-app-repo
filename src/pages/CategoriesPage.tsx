import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../api/categories';
import { fetchHealth } from '../api/health';
import { fetchProducts } from '../api/products';

const CategoriesPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth
  });
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  const {
    data: products = [],
    isLoading: productsLoading
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts()
  });

  const countByCategory = useMemo(() => {
    const map = new Map<number, number>();
    for (const product of products) {
      const categoryId = product.category_id;
      if (!categoryId) {
        continue;
      }
      map.set(categoryId, (map.get(categoryId) ?? 0) + 1);
    }
    return map;
  }, [products]);

  return (
    <section>
      <div className="section-head">
        <h2>Categories</h2>
        <span className="pill">
          API: {isLoading ? 'checking' : isError ? 'down' : data?.status}
        </span>
      </div>

      <div className="grid">
        {categoriesLoading ? (
          <div className="card empty">Loading categories...</div>
        ) : categoriesError ? (
          <div className="card empty">Failed to load categories.</div>
        ) : categories.length === 0 ? (
          <div className="card empty">No categories yet.</div>
        ) : (
          categories.map((category) => {
            const count = countByCategory.get(category.id) ?? 0;
            const countLabel = productsLoading ? '...' : `${count}`;
            return (
              <Link key={category.id} className="card" to={`/category/${category.id}`}>
                <h3>{category.name}</h3>
                <p>{countLabel} items</p>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
};

export default CategoriesPage;
