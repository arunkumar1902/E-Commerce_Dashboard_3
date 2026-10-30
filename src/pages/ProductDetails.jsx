import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import QuantitySelector from "../components/QuantitySelector";
import { useCart } from "../context/CartContext";
import initialProducts from "../data/products";
import { formatPrice, readStorage } from "../utils/storage";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products] = useState(() =>
    readStorage("shop_products", initialProducts)
  );

  const product = products.find((item) => item.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/products" className="btn-primary mt-5">
          Browse Products
        </Link>
      </main>
    );
  }

  const related = products
    .filter(
      (item) =>
        item.category === product.category && item.id !== product.id
    )
    .slice(0, 4);

  function handleAddToCart() {
    try {
      addToCart(product, quantity);
      navigate("/cart");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <main className="container-page py-10">
      <div className="mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        {" / "}
        <Link to="/products" className="hover:text-indigo-600">Products</Link>
        {" / "}
        <span className="text-slate-800">{product.name}</span>
      </div>

      <div className="grid items-start gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-white">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square w-full rounded-2xl object-cover"
          />
        </div>

        <div className="py-2">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            {product.category}
          </p>

          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-amber-500">★★★★★</span>
            <span className="text-sm font-semibold">{product.rating}/5</span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-3xl font-black">
              {formatPrice(product.price)}
            </span>

            {product.originalPrice > product.price && (
              <span className="text-lg text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="mt-6 leading-7 text-slate-600">
            {product.description}
          </p>

          <p className="mt-5 text-sm">
            Availability:{" "}
            <span className={product.stock > 0 ? "font-bold text-emerald-600" : "font-bold text-rose-600"}>
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </span>
          </p>

          {product.stock > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold">Quantity</p>
              <QuantitySelector
                quantity={quantity}
                max={product.stock}
                onChange={setQuantity}
              />
            </div>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={product.stock < 1}
              onClick={handleAddToCart}
              className="btn-primary"
            >
              Add to Cart · {formatPrice(product.price * quantity)}
            </button>

            <Link to="/products" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-extrabold">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </main>
  );
}