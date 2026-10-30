import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-950 text-slate-300">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-3">
        <div>
          <Link to="/" className="text-2xl font-extrabold text-white">
            E-Commerce.
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
            Everyday essentials, thoughtfully selected. Shop your favorites
            in one place.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white">Shop</h3>
          <div className="mt-3 grid gap-2 text-sm">
            <Link to="/products" className="hover:text-white">
              All Products
            </Link>
            <Link to="/cart" className="hover:text-white">
              Shopping Cart
            </Link>
            <Link to="/orders" className="hover:text-white">
              Order History
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white">Customer Support</h3>
          <p className="mt-3 text-sm text-slate-400">
            Need help? Contact support@example.com.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} E-Commerce.
      </div>
    </footer>
  );
}
