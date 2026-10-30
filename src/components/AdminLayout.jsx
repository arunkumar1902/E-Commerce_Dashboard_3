import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <section className="container-page py-8">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            ADMINISTRATION
          </p>
          <h1 className="page-title mt-1">Store Management</h1>
        </div>

        <NavLink to="/products" className="btn-secondary">
          View Store
        </NavLink>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `rounded-lg px-4 py-2 text-sm font-semibold ${
              isActive
                ? "bg-indigo-600 text-white"
                : "border bg-white text-slate-600"
            }`
          }
        >
          Products
        </NavLink>
      </div>

      <Outlet />
    </section>
  );
}
