import { useState } from "react";
import { Link } from "react-router-dom";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      updateProfile({ name });
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container-page py-10">
      <h1 className="page-title">My Profile</h1>
      <p className="mt-2 text-slate-500">
        Manage your account information.
      </p>

      <div className="mt-8 grid items-start gap-6 md:grid-cols-[260px_1fr]">
        <aside className="card p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-extrabold text-indigo-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <h2 className="mt-4 text-lg font-extrabold">{user?.name}</h2>
          <p className="mt-1 break-all text-sm text-slate-500">
            {user?.email}
          </p>

          <Link
            to="/orders"
            className="mt-5 inline-block text-sm font-bold text-indigo-600"
          >
            View My Orders →
          </Link>
        </aside>

        <form onSubmit={handleSubmit} className="card space-y-5 p-6">
          <h2 className="text-xl font-extrabold">Personal information</h2>

          {message && (
            <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
              {message}
            </p>
          )}

          {error && (
            <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </p>
          )}

          <FormInput
            label="Full name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <div className="form-field">
            <label>Email address</label>
            <input value={user?.email || ""} disabled />
            <p className="text-xs text-slate-500">
              Email changes are not supported in this demo.
            </p>
          </div>

          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </form>
      </div>
    </main>
  );
}
