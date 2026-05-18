import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";

export default function Sidebar({
  darkMode = true,
  setDarkMode = () => {},
  onNewChat = () => {},
}) {

  const cartItems = useCartStore(
    (state) => state.cartItems
  );

  return (
    <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-[var(--app-border)] bg-[var(--app-sidebar)] p-5 text-[var(--app-text)] backdrop-blur-xl">

      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--app-text)]">
          AI Shop
        </h1>

        <p className="text-sm leading-6 text-[var(--app-text-muted)]">
          Smart discovery, comparison, and checkout in one place.
        </p>
      </div>

      <button
        onClick={onNewChat}
        className="mb-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-primary)] px-4 py-3 text-sm font-semibold text-[var(--app-primary-contrast)] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:opacity-95"
      >
        + New Chat
      </button>

      <div className="flex flex-col gap-2 text-sm font-medium text-[var(--app-text-muted)]">

        <Link
          to="/"
          className="rounded-2xl px-4 py-3 transition hover:bg-[var(--app-primary-soft)] hover:text-[var(--app-text)]"
        >
          Home
        </Link>

        <Link
          to="/history"
          className="rounded-2xl px-4 py-3 transition hover:bg-[var(--app-primary-soft)] hover:text-[var(--app-text)]"
        >
          Chat History
        </Link>

        <Link
          to="/saved"
          className="rounded-2xl px-4 py-3 transition hover:bg-[var(--app-primary-soft)] hover:text-[var(--app-text)]"
        >
          Saved Products
        </Link>

        <Link
          to="/cart"
          className="rounded-2xl px-4 py-3 transition hover:bg-[var(--app-primary-soft)] hover:text-[var(--app-text)]"
        >
          Cart ({cartItems.length})
        </Link>

      </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`mt-auto flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
          darkMode
            ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-50"
            : "border-amber-400/20 bg-amber-100 text-slate-900"
        }`}
        aria-pressed={!darkMode}
      >
        <div className="flex flex-col">
          <span>{darkMode ? "Dark mode" : "Light mode"}</span>
          <span className="text-xs opacity-70">Switch appearance</span>
        </div>

        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full text-lg ${
            darkMode
              ? "bg-white text-slate-950"
              : "bg-slate-900 text-amber-300"
          }`}
        >
          {darkMode ? "🌙" : "☀"}
        </span>
      </button>

    </aside>
  );
}