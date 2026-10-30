import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import initialProducts from "../data/products";
import { readStorage } from "../utils/storage";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products] = useState(() =>
    readStorage("shop_products", initialProducts)
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [maxPrice, setMaxPrice] = useState(25000);
  const [sort, setSort] = useState("featured");

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = `${product.name} ${product.description} ${product.category}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return (
        matchesSearch &&
        matchesCategory &&
        Number(product.price) <= maxPrice
      );
    });

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sort === "name") {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else {
      result = [...result].sort(
        (a, b) => Number(b.featured) - Number(a.featured)
      );
    }

    return result;
  }, [products, search, category, maxPrice, sort]);

  function changeCategory(value) {
    setCategory(value);
    if (value === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: value });
    }
  }

  function resetFilters() {
    setSearch("");
    changeCategory("All");
    setMaxPrice(25000);
    setSort("featured");
  }

  return (
    <main className="container-page py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
          Our collection
        </p>
        <h1 className="page-title mt-2">All Products</h1>
        <p className="mt-2 text-slate-500">
          Search, filter, and discover your next favorite.
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="card space-y-6 p-5">
          <h2 className="text-lg font-bold">Filters</h2>

          <div className="space-y-3">
            <label className="text-sm font-semibold">Category</label>

            {categories.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="category"
                  checked={category === item}
                  onChange={() => changeCategory(item)}
                  className="accent-indigo-600"
                />
                {item}
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <label htmlFor="price" className="text-sm font-semibold">
              Maximum price: ₹{maxPrice.toLocaleString("en-IN")}
            </label>

            <input
              id="price"
              type="range"
              min="0"
              max="25000"
              step="500"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="w-full accent-indigo-600"
            />

            <div className="flex justify-between text-xs text-slate-500">
              <span>₹0</span>
              <span>₹25,000</span>
            </div>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="btn-secondary w-full"
          >
            Reset filters
          </button>
        </aside>

        <section>
          <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_200px]">
            <SearchBar value={search} onChange={setSearch} />

            <select
              aria-label="Sort products"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-500"
            >
              <option value="featured">Featured first</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Highest rated</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {filteredProducts.length} products found
            </p>
          </div>

          <ProductGrid products={filteredProducts} />
        </section>
      </div>
    </main>
  );
}