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
    <div className="flex-1 bg-[#0f0f0f] text-white p-8 overflow-y-auto">

      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Shipping Form */}
        <div className="bg-[#171717] border border-gray-800 rounded-2xl p-6">

          <h2 className="text-2xl font-semibold mb-6">
            Shipping Details
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-[#1f1f1f] rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="text"
              placeholder="Address"
              className="w-full bg-[#1f1f1f] rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="text"
              placeholder="City"
              className="w-full bg-[#1f1f1f] rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="text"
              placeholder="Postal Code"
              className="w-full bg-[#1f1f1f] rounded-xl px-4 py-3 outline-none"
            />

          </div>

        </div>

        {/* Order Summary */}
        <div className="bg-[#171717] border border-gray-800 rounded-2xl p-6">

          <h2 className="text-2xl font-semibold mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">

            {cartItems.map((item, index) => (

              <div
                key={index}
                className="flex justify-between border-b border-gray-800 pb-3"
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

          <div className="flex justify-between text-2xl font-bold mb-6">

            <span>Total</span>

            <span>
              ₹{totalPrice.toLocaleString()}
            </span>

          </div>

        <Link to="/success">

        <button className="w-full bg-white text-black py-3 rounded-xl font-semibold">
            Place Order
        </button>

        </Link>

        </div>

      </div>

    </div>
  );
}