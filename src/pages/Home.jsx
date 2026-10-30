import { Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import { readStorage } from "../utils/storage";
import initialProducts from "../data/products";

export default function Home() {
  const products = readStorage("shop_products", initialProducts);
  const featured = products.filter((product) => product.featured).slice(0, 4);

  return (
    <main>
      <section className="container-page py-8 sm:py-12">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-indigo-50 p-7 sm:p-12 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-indigo-700">
              The everyday collection
            </span>

            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-6xl">
              Find your next
              <span className="text-indigo-600"> favorite thing.</span>
            </h1>

            <p className="mt-5 max-w-lg leading-7 text-slate-600">
              Discover thoughtfully selected electronics, fashion,
              accessories, and home essentials at prices you'll love.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">
                Shop Now →
              </Link>
              <a href="#featured" className="btn-secondary">
                Explore Featured
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600">
              <span>✓ Quality picks</span>
              <span>✓ Easy checkout</span>
              <span>✓ Secure-ready design</span>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1100"
              alt="Modern retail store"
              className="h-64 w-full rounded-2xl object-cover shadow-xl sm:h-96"
            />
            <div className="absolute -bottom-4 -left-2 rounded-xl bg-white p-4 shadow-lg sm:left-4">
              <p className="text-xs text-slate-500">Customer favorite</p>
              <p className="mt-1 font-bold text-slate-900">
                Shop the collection
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Browse by interest
            </p>
            <h2 className="mt-2 text-2xl font-extrabold">Shop categories</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["Electronics", "🎧"],
            ["Fashion", "👟"],
            ["Accessories", "⌚"],
            ["Home", "🏠"],
          ].map(([category, icon]) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-md"
            >
              <span className="text-3xl">{icon}</span>
              <h3 className="mt-4 font-bold">{category}</h3>
              <p className="mt-1 text-sm text-slate-500">Explore collection →</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="featured" className="container-page scroll-mt-24 py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Handpicked for you
            </p>
            <h2 className="mt-2 text-3xl font-extrabold">
              Featured products
            </h2>
          </div>

          <Link
            to="/products"
            className="text-sm font-bold text-indigo-600 hover:underline"
          >
            View all products →
          </Link>
        </div>

        <ProductGrid products={featured} />
      </section>

      <section className="container-page">
        <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-slate-900 p-7 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-extrabold">
              Your next great find is waiting.
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Explore the full collection and find something you'll love.
            </p>
          </div>

          <Link to="/products" className="btn-primary">
            Explore Products
          </Link>
        </div>
      </section>
    </main>
  );
}