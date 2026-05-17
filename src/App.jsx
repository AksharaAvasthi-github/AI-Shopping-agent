export default function App() {
  return (
    <div className="bg-[#0f0f0f] text-white h-screen flex">

      {/* Sidebar */}
      <div className="w-64 bg-[#171717] border-r border-gray-800 p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">
          AI Shop
        </h1>

        <button className="bg-white text-black rounded-lg py-2 px-4 mb-4 hover:bg-gray-200 transition">
          + New Chat
        </button>

        <div className="flex flex-col gap-3 text-gray-300">
          <button className="text-left hover:text-white">
            Chat History
          </button>

          <button className="text-left hover:text-white">
            Saved Products
          </button>

          <button className="text-left hover:text-white">
            Cart
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="border-b border-gray-800 p-4 text-xl font-semibold">
          AI Shopping Assistant
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* AI Message */}
          <div className="bg-[#1f1f1f] p-4 rounded-2xl max-w-xl">
            Hi! What product are you looking for today?
          </div>

          {/* User Message */}
          <div className="bg-white text-black p-4 rounded-2xl max-w-xl ml-auto">
            Best headphones under ₹5000
          </div>

        </div>

        {/* Input Area */}
        <div className="border-t border-gray-800 p-4 flex gap-3">
          <input
            type="text"
            placeholder="Ask for products..."
            className="flex-1 bg-[#1f1f1f] rounded-xl px-4 py-3 outline-none"
          />

          <button className="bg-white text-black px-6 rounded-xl font-medium hover:bg-gray-200 transition">
            Send
          </button>
        </div>

      </div>
    </div>
  )
}