import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/storage";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <Link
        to={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-slate-100"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {product.originalPrice > product.price && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white">
            SALE
          </span>
        )}
      </Link>

      <div className="space-y-3 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
          {product.category}
        </p>

        <Link to={`/products/${product.id}`}>
          <h3 className="line-clamp-1 font-bold text-slate-800 hover:text-indigo-600">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-amber-500">★</span>
          <span>{product.rating}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500">
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg font-extrabold text-slate-900">
            {formatPrice(product.price)}
          </span>

          {product.originalPrice > product.price && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={product.stock < 1}
          onClick={() => {
            try {
              addToCart(product);
            } catch (error) {
              alert(error.message);
            }
          }}
          className="btn-primary w-full"
        >
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}
