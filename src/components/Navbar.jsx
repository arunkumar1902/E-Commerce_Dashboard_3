import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const linkStyle = ({ isActive }) =>
  `text-sm font-medium transition ${
    isActive
      ? "text-indigo-600"
      : "text-slate-600 hover:text-indigo-600"
  }`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page flex min-h-16 items-center justify-between gap-4">
        <Link to="/" className="text-xl font-extrabold tracking-tight">
          <span className="text-indigo-600">E-</span>Commerce.
        </Link>

        <button
          className="rounded-lg border px-3 py-2 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav
          className={`${
            menuOpen ? "flex" : "hidden"
          } absolute left-0 right-0 top-16 flex-col gap-5 border-b bg-white p-5 shadow-lg md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkStyle}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          {user && (
            <>
              <NavLink
                to="/orders"
                className={linkStyle}
                onClick={() => setMenuOpen(false)}
              >
                My Orders
              </NavLink>

              <NavLink
                to="/profile"
                className={linkStyle}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </NavLink>
            </>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/admin/products"
              className={linkStyle}
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </NavLink>
          )}

          <NavLink
            to="/cart"
            className={linkStyle}
            onClick={() => setMenuOpen(false)}
          >
            Cart ({itemCount})
          </NavLink>

          {user ? (
            <button
              onClick={handleLogout}
              className="text-left text-sm font-semibold text-rose-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="btn-primary"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
