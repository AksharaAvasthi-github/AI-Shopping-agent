export default function ComparisonModal({
  products,
  onClose,
}) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] shadow-2xl shadow-black/40">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-primary-soft)] text-xl text-[var(--app-text-muted)] transition hover:bg-[var(--app-primary-soft-hover)] hover:text-[var(--app-text)]"
          aria-label="Close comparison modal"
        >
          ✕
        </button>

        <div className="border-b border-[var(--app-border)] px-6 py-6 sm:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--app-text-muted)]">
            Product Comparison
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--app-text)] sm:text-3xl">
            Compare your top picks side by side
          </h1>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {products.map((product, index) => (
              <article
                key={index}
                className="overflow-hidden rounded-[1.75rem] border border-[var(--app-border)] bg-[var(--app-surface)]"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-64 w-full object-cover"
                />

                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-[var(--app-text)]">
                    {product.name}
                  </h2>

                  <div className="mt-5 space-y-4 text-sm text-[var(--app-text-muted)]">
                    <p>
                      <span className="font-semibold text-[var(--app-text)]">Price:</span>{" "}
                      {product.price}
                    </p>

                    <p>
                      <span className="font-semibold text-[var(--app-text)]">Rating:</span>{" "}
                      ⭐ {product.rating}
                    </p>

                    <p>
                      <span className="font-semibold text-[var(--app-text)]">Category:</span>{" "}
                      {product.category || "Electronics"}
                    </p>

                    <p>
                      <span className="font-semibold text-[var(--app-text)]">Delivery:</span>{" "}
                      2-3 Days
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}