import { Link } from "react-router-dom";

export default function SuccessPage() {

  return (
    <div className="flex-1 flex items-center justify-center bg-[var(--app-bg)] p-8 text-[var(--app-text)]">

      <div className="w-full max-w-xl rounded-[2rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-12 text-center shadow-2xl shadow-black/10">

        <div className="mb-6 text-7xl">
          ✅
        </div>

        <h1 className="mb-4 text-4xl font-bold">
          Order Placed Successfully
        </h1>

        <p className="mb-8 text-lg text-[var(--app-text-muted)]">
          Thank you for shopping with AI Shop.
          Your order has been confirmed.
        </p>

        <Link to="/app">

          <button className="rounded-xl bg-[var(--app-primary)] px-8 py-4 font-semibold text-[var(--app-primary-contrast)] transition hover:opacity-95">
            Continue Shopping
          </button>

        </Link>

      </div>

    </div>
  );
}