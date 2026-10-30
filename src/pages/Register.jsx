import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";
import { validateRegistration } from "../utils/validation";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  function handleChange(event) {
    setValues((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateRegistration(values);
    setErrors(nextErrors);
    setServerError("");

    if (Object.keys(nextErrors).length > 0) return;

    try {
      register(values);
      navigate("/profile", { replace: true });
    } catch (error) {
      setServerError(error.message);
    }
  }

  return (
    <main className="container-page flex min-h-[65vh] items-center justify-center py-12">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-lg space-y-5 p-6 sm:p-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-extrabold">Create an account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Join E-Commerce and start shopping.
          </p>
        </div>

        {serverError && (
          <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            {serverError}
          </p>
        )}

        <FormInput
          label="Full name"
          name="name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Your name"
          required
        />

        <FormInput
          label="Email"
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
          placeholder="At least 8 characters"
          required
        />

        <FormInput
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
          required
        />

        <button type="submit" className="btn-primary w-full">
          Create Account
        </button>

        <p className="text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link to="/login" className="font-bold text-indigo-600">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
