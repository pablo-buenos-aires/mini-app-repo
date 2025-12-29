import { Link } from 'react-router-dom';
import type { Category } from '../api/categories';

type CategoryGridProps = {
  categories: Category[];
  counts: Map<number, number>;
};

const CategoryGrid = ({ categories, counts }: CategoryGridProps) => {
  return (
    <div className="grid">
      {categories.map((category) => (
        <Link key={category.id} className="card category-card" to={`/category/${category.id}`}>
          <div className="category-icon">C</div>
          <div className="category-meta">
            <h3>{category.name}</h3>
            <p>{counts.get(category.id) ?? 0} товаров</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
