import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";
import { validateEmail } from "../utils/validation";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({
    email: "admin@example.com",
    password: "Admin123!",
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

    setServerError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (!validateEmail(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    try {
      const loggedInUser = login(values.email, values.password);

      const destination =
        location.state?.from ||
        (loggedInUser.role === "admin" ? "/admin/products" : "/");

      navigate(destination, { replace: true });
    } catch (error) {
      setServerError(error.message);
    }
  }

  return (
    <main className="container-page flex min-h-[65vh] items-center justify-center py-12">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-md space-y-5 p-6 sm:p-8"
      >
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-extrabold">Sign in</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue shopping.
          </p>
        </div>

        {serverError && (
          <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            {serverError}
          </p>
        )}

        <FormInput
          label="Email address"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
          required
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
          required
        />

        <button type="submit" className="btn-primary w-full">
          Sign In
        </button>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold text-indigo-600">
            Create one
          </Link>
        </p>

        <div className="rounded-lg bg-slate-50 p-3 text-xs leading-6 text-slate-600">
          <p className="font-bold">Demo admin login</p>
          <p>Email: admin@example.com</p>
          <p>Password: Admin123!</p>
        </div>
      </form>
    </main>
  );
}
