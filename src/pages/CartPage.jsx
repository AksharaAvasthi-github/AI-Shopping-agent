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
    <div className="flex-1 bg-[#0f0f0f] text-white p-8 overflow-y-auto">

      <h1 className="text-3xl font-bold mb-8">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (

        <p className="text-gray-400">
          Your cart is empty.
        </p>

      ) : (

        <div className="space-y-6">

          {cartItems.map((product, index) => (

            <div
              key={index}
              className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 flex gap-6 items-center"
            >

              <img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-xl"
              />

              <div className="flex-1">

                <h2 className="text-2xl font-semibold mb-2">
                  {product.name}
                </h2>

                <p className="text-gray-300 mb-2">
                  {product.price}
                </p>

                <p className="text-yellow-400">
                  ⭐ {product.rating}
                </p>

              </div>

              <button
                onClick={() => removeFromCart(index)}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl"
              >
                Remove
              </button>

            </div>

          ))}

          {/* Total */}
          <div className="bg-[#171717] border border-gray-800 rounded-2xl p-6">

            <h2 className="text-2xl font-bold mb-4">
              Order Summary
            </h2>

            <p className="text-xl mb-6">
              Total: ₹{totalPrice.toLocaleString()}
            </p>

            <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold">
              Proceed to Checkout
            </button>

          </div>

        </div>

      )}

    </div>
  );
}