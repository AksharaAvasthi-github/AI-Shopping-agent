import useCartStore from "../store/cartStore";

export default function ProductCard({ product }) {

  const addToCart = useCartStore((state) => state.addToCart);
  const categoryLabel = product.category || "Electronics";

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-[var(--app-border)] bg-[var(--app-surface)] shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-[var(--app-border-strong)] hover:bg-[var(--app-surface-strong)]">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4 rounded-full border border-[var(--app-border)] bg-[var(--app-primary)] px-3 py-1 text-xs font-medium text-[var(--app-primary-contrast)] backdrop-blur">
          {categoryLabel}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold leading-6 text-[var(--app-text)]">
            {product.name}
          </h2>

          <span className="shrink-0 rounded-full border border-[var(--app-border)] bg-[var(--app-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--app-text)]">
            ⭐ {product.rating}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-2xl font-bold tracking-tight text-[var(--app-text)]">
            {product.price}
          </p>

          <p className="text-xs uppercase tracking-[0.3em] text-[var(--app-text-muted)]">
            Best value
          </p>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 rounded-2xl bg-[var(--app-primary)] px-4 py-3 text-sm font-semibold text-[var(--app-primary-contrast)] transition hover:opacity-95"
          >
            Add to Cart
          </button>

          <button className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-primary-soft)] px-4 py-3 text-sm font-medium text-[var(--app-text)] transition hover:bg-[var(--app-primary-soft-hover)]">
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}