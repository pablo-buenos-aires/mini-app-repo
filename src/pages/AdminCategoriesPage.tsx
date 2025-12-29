import { useEffect, useState } from 'react';
import {
  createCategory,
  deleteCategory,
  fetchAdminCategories,
  updateCategory,
  type Category
} from '../api/categories';

type CategoryDraft = {
  name: string;
  sort: string;
};

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [drafts, setDrafts] = useState<Record<number, CategoryDraft>>({});
  const [name, setName] = useState('');
  const [sort, setSort] = useState('0');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAdminCategories();
      setCategories(data);
      const nextDrafts: Record<number, CategoryDraft> = {};
      data.forEach((category) => {
        nextDrafts[category.id] = {
          name: category.name,
          sort: String(category.sort)
        };
      });
      setDrafts(nextDrafts);
    } catch {
      setError('Failed to load categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Name is required.');
      return;
    }
    const parsedSort = Number.parseInt(sort, 10);
    if (Number.isNaN(parsedSort)) {
      setError('Sort must be a number.');
      return;
    }
    try {
      await createCategory({ name: trimmedName, sort: parsedSort });
      setName('');
      setSort('0');
      await loadCategories();
    } catch {
      setError('Failed to create category.');
    }
  };

  const handleUpdate = async (id: number) => {
    const draft = drafts[id];
    if (!draft) {
      return;
    }
    const trimmedName = draft.name.trim();
    if (!trimmedName) {
      setError('Name is required.');
      return;
    }
    const parsedSort = Number.parseInt(draft.sort, 10);
    if (Number.isNaN(parsedSort)) {
      setError('Sort must be a number.');
      return;
    }
    try {
      await updateCategory(id, { name: trimmedName, sort: parsedSort });
      await loadCategories();
    } catch {
      setError('Failed to update category.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch {
      setError('Failed to delete category.');
    }
  };

  return (
    <section>
      <div className="section-head">
        <h2>Admin Categories</h2>
      </div>
      <div className="card stack">
        <h3>Create category</h3>
        <div className="row">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            type="number"
            placeholder="Sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          />
          <button className="btn" type="button" onClick={handleCreate}>
            Add
          </button>
        </div>
        {error ? <div className="pill">{error}</div> : null}
      </div>
      {isLoading ? (
        <div className="card empty">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="card empty">No categories yet.</div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Sort</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const draft = drafts[category.id];
                return (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>
                      <input
                        type="text"
                        value={draft?.name ?? category.name}
                        onChange={(event) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [category.id]: {
                              name: event.target.value,
                              sort: draft?.sort ?? String(category.sort)
                            }
                          }))
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={draft?.sort ?? String(category.sort)}
                        onChange={(event) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [category.id]: {
                              name: draft?.name ?? category.name,
                              sort: event.target.value
                            }
                          }))
                        }
                      />
                    </td>
                    <td>
                      <div className="row">
                        <button className="btn ghost" type="button" onClick={() => handleUpdate(category.id)}>
                          Save
                        </button>
                        <button className="btn ghost" type="button" onClick={() => handleDelete(category.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminCategoriesPage;
