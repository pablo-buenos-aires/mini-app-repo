import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchCategories } from '../api/categories';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import useCartStore from '../store/cart';

const CategoryPage = () => {
  const params = useParams();
  const categoryId = Number(params.id);
  const isValidId = Number.isFinite(categoryId) && categoryId > 0;
  const [query, setQuery] = useState('');
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);

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
    return match?.name ?? `Категория ${params.id ?? ''}`;
  }, [categories, categoryId, params.id]);

  const visibleProducts = useMemo(() => products, [products]);

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return visibleProducts;
    }
    return visibleProducts.filter((product) =>
      product.title.toLowerCase().includes(needle)
    );
  }, [query, visibleProducts]);

  const qtyById = useMemo(() => {
    const map = new Map<number, number>();
    for (const item of items) {
      map.set(item.product_id, item.qty);
    }
    return map;
  }, [items]);

  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">{categoryName}</h2>
      </div>
      <SearchBar value={query} onChange={setQuery} placeholder="Поиск товаров" />

      {!isValidId ? (
        <div className="card empty">Некорректная категория.</div>
      ) : isLoading ? (
        <div className="card empty">Загружаем товары...</div>
      ) : isError ? (
        <div className="card empty">Не удалось загрузить товары.</div>
      ) : filteredProducts.length === 0 ? (
        <div className="card empty">Товары не найдены.</div>
      ) : (
        <div className="stack">
          {filteredProducts.map((product) => {
            const qty = qtyById.get(product.id) ?? 0;
            return (
              <ProductCard
                key={product.id}
                product={product}
                qty={qty}
                detailHref={`/product/${product.id}`}
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
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CategoryPage;
