import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar.jsx";
import ChatMessage from "./components/ChatMessage.jsx";
import ProductCard from "./components/ProductCard.jsx";

import CartPage from "./pages/CartPage.jsx";
import SavedPage from "./pages/SavedPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";

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

  const HomePage = () => (
    <div className="flex-1 flex flex-col bg-[#0f0f0f] text-white">

      {/* Header */}
      <div className="border-b border-gray-800 p-4 text-xl font-semibold">
        AI Shopping Assistant
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            sender={msg.sender}
            text={msg.text}
          />
        ))}

        {loading && (
          <div className="bg-[#1f1f1f] p-4 rounded-2xl max-w-xl">
            Thinking...
          </div>
        )}

        {products.length > 0 && (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

            {products.map((product, index) => (
              <ProductCard
                key={index}
                product={product}
              />
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
  );

  return (
    <div className="h-screen flex bg-[#0f0f0f]">

      <Sidebar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>

    </div>
  );
}