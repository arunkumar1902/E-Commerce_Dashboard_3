import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatPrice, readStorage } from "../utils/storage";

export default function OrderHistory() {
  const { user } = useAuth();
  const location = useLocation();

  const allOrders = readStorage("shop_orders", []);
  const orders = allOrders.filter(
    (order) => order.userId === user?.id
  );

  return (
    <main className="container-page py-10">
      <h1 className="page-title">My Orders</h1>
      <p className="mt-2 text-slate-500">
        Review your purchases and order details.
      </p>

      {location.state?.orderPlaced && (
        <div role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <h2 className="font-bold text-emerald-800">Order placed successfully!</h2>
          <p className="mt-1 text-sm text-emerald-700">
            Order reference: {location.state.orderId}
          </p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <div className="text-5xl">📦</div>
          <h2 className="mt-4 text-xl font-extrabold">No orders yet</h2>
          <p className="mt-2 text-sm text-slate-500">
            Your completed demo checkouts will appear here.
          </p>
          <Link to="/products" className="btn-primary mt-5">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((order) => (
            <article key={order.id} className="card p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4">
                <div>
                  <h2 className="font-extrabold">{order.id}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="text-right">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    {order.status}
                  </span>
                  <p className="mt-2 font-extrabold">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-slate-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t pt-4 text-sm text-slate-500">
                Delivery to: {order.customer.address}, {order.customer.city},{" "}
                {order.customer.state} - {order.customer.pincode}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
