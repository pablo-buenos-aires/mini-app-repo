import { ChangeEvent, useEffect, useState } from 'react';
import {
  createProduct,
  fetchAdminProducts,
  presignProductPhoto,
  updateProduct,
  type Product
} from '../api/products';
import { fetchAdminCategories, type Category } from '../api/categories';

type ProductDraft = {
  title: string;
  price_cents: string;
  currency: string;
  stock: string;
  active: boolean;
  category_id: string;
  description: string;
  photo_url: string;
};

const toDraft = (product: Product): ProductDraft => ({
  title: product.title,
  price_cents: String(product.price_cents),
  currency: product.currency,
  stock: String(product.stock),
  active: product.active,
  category_id: product.category_id ? String(product.category_id) : '',
  description: product.description ?? '',
  photo_url: product.photo_url ?? ''
});

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [drafts, setDrafts] = useState<Record<number, ProductDraft>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [s3Disabled, setS3Disabled] = useState(false);

  const [newProduct, setNewProduct] = useState<ProductDraft>({
    title: '',
    price_cents: '',
    currency: 'ARS',
    stock: '0',
    active: true,
    category_id: '',
    description: '',
    photo_url: ''
  });

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    setS3Disabled(false);
    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchAdminProducts(),
        fetchAdminCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      const nextDrafts: Record<number, ProductDraft> = {};
      productsData.forEach((product) => {
        nextDrafts[product.id] = toDraft(product);
      });
      setDrafts(nextDrafts);
    } catch {
      setError('Failed to load products.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const parseDraft = (draft: ProductDraft) => {
    const price = Number.parseInt(draft.price_cents, 10);
    if (Number.isNaN(price)) {
      throw new Error('Price must be a number.');
    }
    const stock = Number.parseInt(draft.stock, 10);
    if (Number.isNaN(stock)) {
      throw new Error('Stock must be a number.');
    }
    const categoryValue = draft.category_id.trim();
    const categoryId = categoryValue === '' ? 0 : Number.parseInt(categoryValue, 10);
    if (categoryValue !== '' && Number.isNaN(categoryId)) {
      throw new Error('Category ID must be a number.');
    }

    return {
      category_id: categoryId,
      title: draft.title.trim(),
      description: draft.description.trim(),
      price_cents: price,
      currency: draft.currency.trim(),
      photo_url: draft.photo_url.trim(),
      stock,
      active: draft.active
    };
  };

  const handleCreate = async () => {
    try {
      const payload = parseDraft(newProduct);
      if (!payload.title) {
        setError('Title is required.');
        return;
      }
      if (!payload.currency) {
        setError('Currency is required.');
        return;
      }
      await createProduct(payload);
      setNewProduct({
        title: '',
        price_cents: '',
        currency: 'ARS',
        stock: '0',
        active: true,
        category_id: '',
        description: '',
        photo_url: ''
      });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product.');
    }
  };

  const handleUpdate = async (id: number) => {
    const draft = drafts[id];
    if (!draft) {
      return;
    }
    try {
      const payload = parseDraft(draft);
      await updateProduct(id, payload);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product.');
    }
  };

  const handlePhotoUpload = async (productId: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }
    setUploadingId(productId);
    setError(null);
    setS3Disabled(false);
    try {
      const presign = await presignProductPhoto(productId, file.type);
      if (presign.disabled || !presign.upload_url) {
        setS3Disabled(true);
        return;
      }
      const uploadRes = await fetch(presign.upload_url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file
      });
      if (!uploadRes.ok) {
        throw new Error('Upload failed.');
      }
      await updateProduct(productId, { photo_url: presign.public_url });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo.');
    } finally {
      setUploadingId(null);
    }
  };

  const categoryOptions = categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ));

  return (
    <section>
      <div className="section-head">
        <h2>Admin Products</h2>
      </div>
      <div className="card stack">
        <h3>Create product</h3>
        <div className="grid">
          <input
            type="text"
            placeholder="Title"
            value={newProduct.title}
            onChange={(event) => setNewProduct((prev) => ({ ...prev, title: event.target.value }))}
          />
          <input
            type="number"
            placeholder="Price cents"
            value={newProduct.price_cents}
            onChange={(event) => setNewProduct((prev) => ({ ...prev, price_cents: event.target.value }))}
          />
          <input
            type="text"
            placeholder="Currency"
            value={newProduct.currency}
            onChange={(event) => setNewProduct((prev) => ({ ...prev, currency: event.target.value }))}
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(event) => setNewProduct((prev) => ({ ...prev, stock: event.target.value }))}
          />
          <select
            value={newProduct.category_id}
            onChange={(event) => setNewProduct((prev) => ({ ...prev, category_id: event.target.value }))}
          >
            <option value="">No category</option>
            {categoryOptions}
          </select>
          <select
            value={newProduct.active ? 'true' : 'false'}
            onChange={(event) =>
              setNewProduct((prev) => ({ ...prev, active: event.target.value === 'true' }))
            }
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <input
            type="text"
            placeholder="Photo URL (optional)"
            value={newProduct.photo_url}
            onChange={(event) => setNewProduct((prev) => ({ ...prev, photo_url: event.target.value }))}
          />
          <textarea
            rows={2}
            placeholder="Description"
            value={newProduct.description}
            onChange={(event) => setNewProduct((prev) => ({ ...prev, description: event.target.value }))}
          />
        </div>
        <button className="btn" type="button" onClick={handleCreate}>
          Add product
        </button>
        {error ? <div className="pill">{error}</div> : null}
        {s3Disabled ? <div className="pill">S3 disabled</div> : null}
      </div>
      {isLoading ? (
        <div className="card empty">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="card empty">No products yet.</div>
      ) : (
        <div className="stack">
          {products.map((product) => {
            const draft = drafts[product.id] ?? toDraft(product);
            return (
              <div key={product.id} className="card stack">
                <div className="row">
                  <strong>#{product.id}</strong>
                  {product.photo_url ? <a href={product.photo_url}>Photo</a> : <span>No photo</span>}
                </div>
                <div className="grid">
                  <input
                    type="text"
                    value={draft?.title ?? product.title}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [product.id]: {
                          ...draft,
                          title: event.target.value
                        }
                      }))
                    }
                  />
                  <input
                    type="number"
                    value={draft?.price_cents ?? String(product.price_cents)}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [product.id]: {
                          ...draft,
                          price_cents: event.target.value
                        }
                      }))
                    }
                  />
                  <input
                    type="text"
                    value={draft?.currency ?? product.currency}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [product.id]: {
                          ...draft,
                          currency: event.target.value
                        }
                      }))
                    }
                  />
                  <input
                    type="number"
                    value={draft?.stock ?? String(product.stock)}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [product.id]: {
                          ...draft,
                          stock: event.target.value
                        }
                      }))
                    }
                  />
                  <select
                    value={draft?.category_id ?? (product.category_id ? String(product.category_id) : '')}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [product.id]: {
                          ...draft,
                          category_id: event.target.value
                        }
                      }))
                    }
                  >
                    <option value="">No category</option>
                    {categoryOptions}
                  </select>
                  <select
                    value={(draft?.active ?? product.active) ? 'true' : 'false'}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [product.id]: {
                          ...draft,
                          active: event.target.value === 'true'
                        }
                      }))
                    }
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Photo URL"
                    value={draft?.photo_url ?? product.photo_url ?? ''}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [product.id]: {
                          ...draft,
                          photo_url: event.target.value
                        }
                      }))
                    }
                  />
                  <textarea
                    rows={2}
                    value={draft?.description ?? product.description ?? ''}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [product.id]: {
                          ...draft,
                          description: event.target.value
                        }
                      }))
                    }
                  />
                </div>
                <div className="row">
                  <div className="row">
                    <label className="btn ghost">
                      {uploadingId === product.id ? 'Uploading...' : 'Upload photo'}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(event) => handlePhotoUpload(product.id, event)}
                        disabled={uploadingId === product.id}
                      />
                    </label>
                    <button className="btn ghost" type="button" onClick={() => handleUpdate(product.id)}>
                      Save
                    </button>
                  </div>
                  <span>Updated {new Date(product.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AdminProductsPage;
