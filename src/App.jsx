import { useState } from "react";

export default function App() {

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! What product are you looking for today?",
    },
  ]);

  const [products, setProducts] = useState([]);

  const handleSend = async () => {

    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const userInput = input;

    setInput("");
    setLoading(true);

    try {

      const response = await fetch("YOUR_N8N_WEBHOOK_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
        }),
      });

      const data = await response.json();

      const aiMessage = {
        sender: "ai",
        text: data.message || "Here are some recommendations.",
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Dynamic products from backend
      setProducts(data.products || []);

      setLoading(false);

    } catch (error) {

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Error connecting to AI agent.",
        },
      ]);

      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f0f] text-white h-screen flex">

      {/* Sidebar */}
      <div className="w-64 bg-[#171717] border-r border-gray-800 p-4 flex flex-col">

        <h1 className="text-2xl font-bold mb-8">
          AI Shop
        </h1>

        <button className="bg-white text-black rounded-lg py-2 px-4 mb-4">
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

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="border-b border-gray-800 p-4 text-xl font-semibold">
          AI Shopping Assistant
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl max-w-xl ${
                msg.sender === "user"
                  ? "bg-white text-black ml-auto"
                  : "bg-[#1f1f1f]"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="bg-[#1f1f1f] p-4 rounded-2xl max-w-xl">
              Thinking...
            </div>
          )}

          {/* Dynamic Product Cards */}
          {products.length > 0 && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

              {products.map((product, index) => (

                <div
                  key={index}
                  className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800"
                >

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-52 object-cover"
                  />

                  <div className="p-4">

                    <h2 className="text-xl font-semibold mb-2">
                      {product.name}
                    </h2>

                    <p className="text-gray-300 mb-1">
                      {product.price}
                    </p>

                    <p className="text-yellow-400 mb-4">
                      ⭐ {product.rating}
                    </p>

                    <div className="flex gap-3">

                      <button className="bg-white text-black px-4 py-2 rounded-xl font-medium">
                        Add to Cart
                      </button>

                      <button className="border border-gray-600 px-4 py-2 rounded-xl">
                        Buy Now
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

        {/* Input */}
        <div className="border-t border-gray-800 p-4 flex gap-3">

          <input
            type="text"
            placeholder="Ask for products..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            className="flex-1 bg-[#1f1f1f] rounded-xl px-4 py-3 outline-none"
          />

          <button
            onClick={handleSend}
            className="bg-white text-black px-6 rounded-xl font-medium"
          >
            Send
          </button>

        </div>

      </div>
    </div>
  );
}