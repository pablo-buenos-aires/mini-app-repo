import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../api/categories';
import { fetchProducts } from '../api/products';
import CategoryGrid from '../components/CategoryGrid';
import SearchBar from '../components/SearchBar';

const CategoriesPage = () => {
  const [query, setQuery] = useState('');
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts()
  });

  const filteredCategories = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return categories;
    }
    return categories.filter((category) => category.name.toLowerCase().includes(needle));
  }, [categories, query]);

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
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Категории</h2>
      </div>
      <SearchBar value={query} onChange={setQuery} placeholder="Поиск категорий" />

      {categoriesLoading ? (
        <div className="card empty">Загружаем категории...</div>
      ) : categoriesError ? (
        <div className="card empty">Не удалось загрузить категории.</div>
      ) : filteredCategories.length === 0 ? (
        <div className="card empty">Ничего не найдено.</div>
      ) : (
        <CategoryGrid
          categories={filteredCategories}
          counts={countByCategory}
        />
      )}
    </section>
  );
};

export default CategoriesPage;
