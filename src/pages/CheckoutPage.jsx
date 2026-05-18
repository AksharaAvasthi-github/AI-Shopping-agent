import useCartStore from "../store/cartStore";
import { Link } from "react-router-dom";

export default function CheckoutPage() {

  const cartItems = useCartStore(
    (state) => state.cartItems
  );

  const totalPrice = cartItems.reduce((total, item) => {

    const numericPrice = Number(
      item.price.replace(/[^0-9]/g, "")
    );

    return total + numericPrice;

  }, 0);

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--app-bg)] p-8 text-[var(--app-text)]">

      <h1 className="mb-8 text-3xl font-bold">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Shipping Form */}
        <div className="rounded-[1.5rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-6">

          <h2 className="mb-6 text-2xl font-semibold">
            Shipping Details
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 py-3 text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-muted)]"
            />

            <input
              type="text"
              placeholder="Address"
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 py-3 text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-muted)]"
            />

            <input
              type="text"
              placeholder="City"
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 py-3 text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-muted)]"
            />

            <input
              type="text"
              placeholder="Postal Code"
              className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 py-3 text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-muted)]"
            />

          </div>

        </div>

        {/* Order Summary */}
        <div className="rounded-[1.5rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-6">

          <h2 className="mb-6 text-2xl font-semibold">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">

            {cartItems.map((item, index) => (

              <div
                key={index}
                className="flex justify-between border-b border-[var(--app-border)] pb-3"
              >

                <span>
                  {item.name}
                </span>

                <span>
                  {item.price}
                </span>

              </div>

            ))}

          </div>

          <div className="mb-6 flex justify-between text-2xl font-bold text-[var(--app-text)]">

            <span>Total</span>

            <span>
              ₹{totalPrice.toLocaleString()}
            </span>

          </div>

        <Link to="/success">

        <button className="w-full rounded-xl bg-[var(--app-primary)] py-3 font-semibold text-[var(--app-primary-contrast)] transition hover:opacity-95">
            Place Order
        </button>

        </Link>

        </div>

      </div>

    </div>
  );
}