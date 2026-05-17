import { Link } from "react-router-dom";

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-800">

        <h1 className="text-3xl font-bold">
          AI Shop
        </h1>

        <Link to="/app">

          <button className="bg-white text-black px-6 py-2 rounded-xl font-semibold">
            Launch App
          </button>

        </Link>

      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-8 py-24 text-center">

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">

          AI Powered <br />

          Shopping Assistant

        </h1>

        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">

          Discover the perfect products using conversational AI,
          intelligent recommendations, voice search, and personalized shopping.

        </p>

        {/* Search Bar */}
       <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-[#171717] border border-gray-800 rounded-2xl p-3">

  <input
    type="text"
    placeholder="Ask AI to find products..."
    className="flex-1 bg-transparent px-4 py-4 outline-none text-lg"
  />

  <Link to="/app">

    <button className="w-full md:w-auto bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition">
      Search
    </button>

  </Link>

</div>

      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-8 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="bg-[#171717] border border-gray-800 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-4">
            AI Recommendations
          </h2>

          <p className="text-gray-400">
            Smart product discovery powered by conversational AI.
          </p>

        </div>

        <div className="bg-[#171717] border border-gray-800 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-4">
            Voice Search
          </h2>

          <p className="text-gray-400">
            Search products naturally using your voice.
          </p>

        </div>

        <div className="bg-[#171717] border border-gray-800 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-4">
            Smart Checkout
          </h2>

          <p className="text-gray-400">
            Personalized shopping experience from discovery to checkout.
          </p>

        </div>

      </div>

    </div>
  );
}