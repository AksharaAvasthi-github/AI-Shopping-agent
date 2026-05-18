import { Link } from "react-router-dom";

export default function LoginPage() {

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] p-6 text-[var(--app-text)]">

      <div className="w-full max-w-md rounded-[2rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-8 shadow-2xl shadow-black/10">

        <h1 className="mb-8 text-center text-4xl font-bold">
          Welcome Back
        </h1>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 py-4 text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-muted)]"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 py-4 text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-muted)]"
          />

          <button className="w-full rounded-xl bg-[var(--app-primary)] py-4 font-semibold text-[var(--app-primary-contrast)] transition hover:opacity-95">
            Login
          </button>

        </div>

        <p className="mt-6 text-center text-[var(--app-text-muted)]">

          Don’t have an account?{" "}

          <Link
            to="/signup"
            className="font-semibold text-[var(--app-text)]"
          >
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
}