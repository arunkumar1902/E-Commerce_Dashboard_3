import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice, readStorage, writeStorage } from "../utils/storage";
import { validateCheckout } from "../utils/validation";

export default function Checkout() {
  const { user } = useAuth();
  const { cart, subtotal, shipping, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  function handleChange(event) {
    setValues((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));

    setErrors((previous) => ({
      ...previous,
      [event.target.name]: "",
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateCheckout(values);
    setErrors(nextErrors);
    setServerError("");

    if (Object.keys(nextErrors).length > 0) return;

    if (cart.length === 0) {
      setServerError("Your cart is empty.");
      return;
    }

    const products = readStorage("shop_products", []);
    const unavailable = cart.find((item) => {
      const current = products.find((product) => product.id === item.id);
      return !current || current.stock < item.quantity;
    });

    if (unavailable) {
      setServerError(
        `The stock for ${unavailable.name} has changed. Please review your cart.`
      );
      return;
    }

    const order = {
      id: `ORD-${Date.now()}`,
      userId: user?.id || null,
      customer: { ...values },
      items: cart.map((item) => ({ ...item })),
      subtotal,
      shipping,
      total,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };

    const orders = readStorage("shop_orders", []);
    writeStorage("shop_orders", [order, ...orders]);

    writeStorage(
      "shop_products",
      products.map((product) => {
        const orderedItem = cart.find((item) => item.id === product.id);

        return orderedItem
          ? { ...product, stock: product.stock - orderedItem.quantity }
          : product;
      })
    );

    clearCart();
    navigate("/orders", {
      replace: true,
      state: { orderPlaced: true, orderId: order.id },
    });
  }

  if (cart.length === 0) {
    return (
      <main className="container-page py-20 text-center">
        <h1 className="text-2xl font-extrabold">Nothing to check out</h1>
        <p className="mt-3 text-slate-500">Your shopping cart is empty.</p>
        <Link to="/products" className="btn-primary mt-5">
          Browse Products
        </Link>
      </main>
    );
  }

  const fields = [
    { name: "name", label: "Full name" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone number", type: "tel" },
    { name: "address", label: "Street address" },
    { name: "city", label: "City" },
    { name: "state", label: "State" },
    { name: "pincode", label: "PIN code" },
  ];

  return (
    <main className="container-page py-10">
      <h1 className="page-title">Checkout</h1>
      <p className="mt-2 text-slate-500">
        Enter your delivery information to place your order.
      </p>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_340px]">
        <form onSubmit={handleSubmit} className="card space-y-5 p-5 sm:p-7">
          <h2 className="text-xl font-extrabold">Delivery details</h2>

          {serverError && (
            <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
              {serverError}
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.name === "address" ? "sm:col-span-2" : ""}
              >
                <FormInput
                  {...field}
                  value={values[field.name]}
                  onChange={handleChange}
                  error={errors[field.name]}
                  required
                />
              </div>
            ))}
          </div>

          <p className="text-xs leading-5 text-slate-500">
            Demo checkout only. No real payment information is collected.
          </p>

          <button type="submit" className="btn-primary w-full">
            Place Order · {formatPrice(total)}
          </button>
        </form>

        <aside className="card space-y-5 p-5">
          <h2 className="text-lg font-extrabold">Order Summary</h2>

          {cart.map((item) => (
            <div key={item.id} className="flex justify-between gap-3 text-sm">
              <span className="text-slate-600">
                {item.name} × {item.quantity}
              </span>
              <span className="font-semibold">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}

          <div className="space-y-3 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{shipping ? formatPrice(shipping) : "FREE"}</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
