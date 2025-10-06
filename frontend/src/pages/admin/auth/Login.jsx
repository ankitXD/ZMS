import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore.js";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const { loginAdmin, loggingIn, loginError } = useAuthStore();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await loginAdmin({ email: email.trim(), password });
    if (res?.ok) {
      navigate(from, { replace: true });
    } else {
      setError(res?.message || "Login failed");
    }
  };

  const displayError = error || loginError;

  return (
    <main
      className="min-h-screen grid place-items-center px-4 py-10"
      style={{ background: "linear-gradient(to bottom, var(--bg), var(--surface))" }}
    >
      <div className="w-full max-w-md rounded-2xl surface p-6 shadow-sm ring-1" style={{ borderColor: 'var(--border)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Admin Login</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Sign in to manage Zoo Verse
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          {displayError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {displayError}
            </div>
          )}

          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@zooverse.com"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-400 focus:outline-none"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Password</span>
            <div className="mt-1 flex items-center rounded-lg border border-slate-300 focus-within:ring-2 focus-within:ring-emerald-500">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-l-lg px-3 py-2 text-sm placeholder-slate-400 focus:outline-none"
                style={{ color: 'var(--text)' }}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="px-3 py-2 text-sm"
                style={{ color: 'var(--muted)' }}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                style={{ borderColor: 'var(--border)' }}
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loggingIn}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 disabled:opacity-50"
          >
            {loggingIn ? "Signing in…" : "Sign In"}
          </button>

          {/* <p className="text-center text-sm text-slate-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-emerald-700 hover:text-emerald-800"
            >
              Create one
            </Link>
          </p> */}
        </form>
      </div>

      {/* Added button */}
      <div className="mt-6 w-full max-w-md text-center">
        <Link to="/" className="text-sm font-medium underline" style={{ color: 'var(--muted)' }}>
          ← Back to Home Page
        </Link>
      </div>
    </main>
  );
};

export default Login;