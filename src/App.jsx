import { useState, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import TypingIndicator from "./components/TypingIndicator.jsx";
import SuccessPage from "./pages/SuccessPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ChatMessage from "./components/ChatMessage.jsx";
import ProductCard from "./components/ProductCard.jsx";
import CartPage from "./pages/CartPage.jsx";
import SavedPage from "./pages/SavedPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";

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
  const recognitionRef = useRef(null);
  const handleVoiceSearch = () => {

  const SpeechRecognition =
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice search not supported in this browser");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {

    let transcript = "";

    for (
      let i = event.resultIndex;
      i < event.results.length;
      i++
    ) {
      transcript += event.results[i][0].transcript;
    }

    setInput(transcript);
  };

  recognition.onerror = (event) => {
    console.error(event.error);
  };

  recognition.start();

  recognitionRef.current = recognition;

  setTimeout(() => {
    recognition.stop();
  }, 5000);
};
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

        {loading && <TypingIndicator />}

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
      <div className="border-t border-gray-800 p-4 flex gap-3 items-center">

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
          onClick={handleVoiceSearch}
          className="bg-[#1f1f1f] px-4 rounded-xl"
       >
          🎤
          </button>

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
  <Routes>

    {/* Landing Page */}
    <Route
      path="/"
      element={<LandingPage />}
    />

    {/* Main App */}
    <Route
      path="/app"
      element={
        <div className="h-screen flex bg-[#0f0f0f]">

          <Sidebar />

          <HomePage />

        </div>
      }
    />

    {/* Cart */}
    <Route
      path="/cart"
      element={
        <div className="h-screen flex bg-[#0f0f0f]">

          <Sidebar />

          <CartPage />

        </div>
      }
    />

    {/* Saved */}
    <Route
      path="/saved"
      element={
        <div className="h-screen flex bg-[#0f0f0f]">

          <Sidebar />

          <SavedPage />

        </div>
      }
    />

    {/* History */}
    <Route
      path="/history"
      element={
        <div className="h-screen flex bg-[#0f0f0f]">

          <Sidebar />

          <HistoryPage />

        </div>
      }
    />

    {/* Checkout */}
    <Route
      path="/checkout"
      element={
        <div className="h-screen flex bg-[#0f0f0f]">

          <Sidebar />

          <CheckoutPage />

        </div>
      }
    />
    <Route
  path="/success"
  element={
    <div className="h-screen flex bg-[#0f0f0f]">

      <Sidebar />

      <SuccessPage />

    </div>
  }
/>

  </Routes>
);
}