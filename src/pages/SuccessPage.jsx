import { Link } from "react-router-dom";

export default function SuccessPage() {

  return (
    <div className="flex-1 bg-[#0f0f0f] text-white flex items-center justify-center p-8">

      <div className="bg-[#171717] border border-gray-800 rounded-3xl p-12 max-w-xl w-full text-center">

        <div className="text-7xl mb-6">
          ✅
        </div>

        <h1 className="text-4xl font-bold mb-4">
          Order Placed Successfully
        </h1>

        <p className="text-gray-400 mb-8 text-lg">
          Thank you for shopping with AI Shop.
          Your order has been confirmed.
        </p>

        <Link to="/app">

          <button className="bg-white text-black px-8 py-4 rounded-xl font-semibold">
            Continue Shopping
          </button>

        </Link>

      </div>

    </div>
  );
}