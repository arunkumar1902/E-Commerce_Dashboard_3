import { Link } from "react-router-dom";
import QuantitySelector from "../components/QuantitySelector";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/storage";

export default function Cart() {
  const {
    cart,
    subtotal,
    shipping,
    total,
    updateQuantity,
    removeFromCart,
  } = useCart();

  if (cart.length === 0) {
    return (
      <main className="container-page py-24 text-center">
        <div className="text-6xl">🛍️</div>
        <h1 className="mt-5 text-3xl font-extrabold">Your cart is empty</h1>
        <p className="mt-3 text-slate-500">
          Explore our collection and add something you love.
        </p>
        <Link to="/products" className="btn-primary mt-6">
          Start Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="container-page py-10">
      <h1 className="page-title">Shopping Cart</h1>
      <p className="mt-2 text-slate-500">
        Review your items before checking out.
      </p>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_340px]">
        <section className="space-y-4">
          {cart.map((item) => (
            <article
              key={item.id}
              className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-28 w-full rounded-xl bg-slate-100 object-cover sm:w-28"
              />

              <div className="min-w-0 flex-1">
                <Link
                  to={`/products/${item.id}`}
                  className="font-bold hover:text-indigo-600"
                >
                  {item.name}
                </Link>

                <p className="mt-2 text-sm text-slate-500">
                  {formatPrice(item.price)} each
                </p>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="mt-3 text-sm font-semibold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-col sm:items-end">
                <QuantitySelector
                  quantity={item.quantity}
                  max={item.stock}
                  onChange={(value) => updateQuantity(item.id, value)}
                />

                <p className="font-extrabold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </article>
          ))}
        </section>

        <aside className="card space-y-5 p-5">
          <h2 className="text-lg font-extrabold">Order Summary</h2>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Delivery</span>
            <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
          </div>

          {shipping > 0 && (
            <p className="text-xs text-indigo-600">
              Free delivery on orders of ₹2,000 or more.
            </p>
          )}

          <div className="border-t border-slate-200 pt-4">
            <div className="flex justify-between text-lg font-extrabold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Link to="/checkout" className="btn-primary w-full">
            Proceed to Checkout
          </Link>

          <Link to="/products" className="btn-secondary w-full">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}
