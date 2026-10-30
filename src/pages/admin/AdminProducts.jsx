import { useEffect, useMemo, useState } from "react";
import initialProducts from "../../data/products";
import { formatPrice, readStorage, writeStorage } from "../../utils/storage";
import FormInput from "../../components/FormInput";
import SearchBar from "../../components/SearchBar";

const emptyProduct = {
  name: "",
  category: "Electronics",
  price: "",
  originalPrice: "",
  rating: "4.0",
  stock: "",
  image: "",
  description: "",
  featured: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState(() =>
    readStorage("shop_products", initialProducts)
  );

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    writeStorage("shop_products", products);
  }, [products]);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        `${product.name} ${product.category}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [products, search]
  );

  function resetForm() {
    setForm(emptyProduct);
    setEditingId(null);
    setError("");
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      ...product,
      price: String(product.price),
      originalPrice: String(product.originalPrice ?? ""),
      rating: String(product.rating),
      stock: String(product.stock),
    });
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const price = Number(form.price);
    const originalPrice = Number(form.originalPrice || form.price);
    const stock = Number(form.stock);
    const rating = Number(form.rating);

    if (!form.name.trim() || !form.category.trim()) {
      setError("Product name and category are required.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Price must be greater than zero.");
      return;
    }

    if (!Number.isFinite(originalPrice) || originalPrice < price) {
      setError("Original price must be equal to or greater than sale price.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock must be a non-negative whole number.");
      return;
    }

    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      setError("Rating must be between 0 and 5.");
      return;
    }

    if (!form.image.trim() || !form.description.trim()) {
      setError("Image URL and description are required.");
      return;
    }

    const product = {
      ...form,
      id: editingId || crypto.randomUUID(),
      name: form.name.trim(),
      price,
      originalPrice,
      rating,
      stock,
      image: form.image.trim(),
      description: form.description.trim(),
    };

    if (editingId) {
      setProducts((previous) =>
        previous.map((item) =>
          item.id === editingId ? product : item
        )
      );
      setSuccess("Product updated successfully.");
    } else {
      setProducts((previous) => [product, ...previous]);
      setSuccess("Product added successfully.");
    }

    resetForm();
  }

  function handleDelete(product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    setProducts((previous) =>
      previous.filter((item) => item.id !== product.id)
    );

    setSuccess("Product deleted successfully.");

    if (editingId === product.id) {
      resetForm();
    }
  }

  return (
    <div className="space-y-8">
      <section className="card p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage the products shown in your store.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="btn-secondary"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FormInput
              label="Product name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <div className="form-field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                {["Electronics", "Fashion", "Accessories", "Home"].map(
                  (category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  )
                )}
              </select>
            </div>

            <FormInput
              label="Sale price (₹)"
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Original price (₹)"
              name="originalPrice"
              type="number"
              min="0"
              step="0.01"
              value={form.originalPrice}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Rating (0–5)"
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Stock quantity"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              required
            />

            <div className="sm:col-span-2 lg:col-span-3">
              <FormInput
                label="Image URL"
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/product.jpg"
                required
              />
            </div>

            <div className="form-field sm:col-span-2 lg:col-span-3">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-indigo-500"
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                name="featured"
                checked={Boolean(form.featured)}
                onChange={handleChange}
                className="accent-indigo-600"
              />
              Show as a featured product
            </label>
          </div>

          <button type="submit" className="btn-primary">
            {editingId ? "Save Changes" : "Add Product"}
          </button>
        </form>
      </section>

      <section className="card overflow-hidden">
        <div className="space-y-4 p-5 sm:flex sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h2 className="text-xl font-extrabold">Product Catalogue</h2>
            <p className="mt-1 text-sm text-slate-500">
              {products.length} products in the store
            </p>
          </div>

          <div className="sm:max-w-xs sm:flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search catalogue..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt=""
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <span className="max-w-48 truncate font-semibold">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">{product.category}</td>

                  <td className="px-5 py-4 font-semibold">
                    {formatPrice(product.price)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={
                        product.stock > 0
                          ? "font-semibold text-emerald-700"
                          : "font-semibold text-rose-600"
                      }
                    >
                      {product.stock}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="rounded-lg border px-3 py-2 font-semibold hover:bg-slate-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="rounded-lg border border-rose-200 px-3 py-2 font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-slate-500">
                    No matching products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
