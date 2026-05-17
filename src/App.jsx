import { useState } from "react";

const N8N_WEBHOOK_URL =
  "http://localhost:5678/webhook-test/1030f359-2168-4af0-b8ce-5f8db2ca7aa2";

export default function App() {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! What product are you looking for today?",
    },
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageText = input;
    const userMessage = {
      sender: "user",
      text: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);
    setInput("");

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
        }),
      });

      const responseText = await response.text();
      let replyText = responseText;

      try {
        const data = JSON.parse(responseText);
        replyText =
          data.output || data.reply || data.message || data.text || JSON.stringify(data);
      } catch {
        // Keep the raw response text when n8n does not return JSON.
      }

      if (!response.ok) {
        throw new Error(replyText || "n8n request failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: replyText || "I got your request from n8n.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            error instanceof Error
              ? `Could not reach n8n: ${error.message}`
              : "Could not reach n8n.",
        },
      ]);
    } finally {
      setIsSending(false);
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

        </div>

        {/* Input */}
        <div className="border-t border-gray-800 p-4 flex gap-3">

          <input
            type="text"
            placeholder="Ask for products..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-[#1f1f1f] rounded-xl px-4 py-3 outline-none"
          />

          <button
            onClick={handleSend}
            disabled={isSending}
            className="bg-white text-black px-6 rounded-xl font-medium"
          >
            {isSending ? "Sending..." : "Send"}
          </button>

        </div>

      </div>
    </div>
  );
}