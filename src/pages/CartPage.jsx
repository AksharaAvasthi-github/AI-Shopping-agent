import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";

export default function CartPage() {

  const cartItems = useCartStore(
    (state) => state.cartItems
  );

  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
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
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (

        <p className="text-[var(--app-text-muted)]">
          Your cart is empty.
        </p>

      ) : (

        <div className="space-y-6">

          {cartItems.map((product, index) => (

            <div
              key={index}
              className="flex items-center gap-6 rounded-[1.5rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-4"
            >

              <img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-xl"
              />

              <div className="flex-1">

                <h2 className="mb-2 text-2xl font-semibold">
                  {product.name}
                </h2>

                <p className="mb-2 text-[var(--app-text-muted)]">
                  {product.price}
                </p>

                <p className="text-[var(--app-warning)]">
                  ⭐ {product.rating}
                </p>

              </div>

              <button
                onClick={() => removeFromCart(index)}
                className="rounded-xl bg-[var(--app-danger)] px-4 py-2 text-white transition hover:opacity-90"
              >
                Remove
              </button>

            </div>

          ))}

          {/* Total */}
          <div className="rounded-[1.5rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-6 shadow-lg shadow-black/5">

            <h2 className="mb-4 text-2xl font-bold">
              Order Summary
            </h2>

            <p className="mb-6 text-xl text-[var(--app-text)]">
              Total: ₹{totalPrice.toLocaleString()}
            </p>

            <Link to="/checkout">

            <button className="rounded-xl bg-[var(--app-primary)] px-6 py-3 font-semibold text-[var(--app-primary-contrast)] transition hover:opacity-95">
                Proceed to Checkout
            </button>

            </Link>


          </div>

        </div>

      )}

    </div>
  );
}