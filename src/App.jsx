import { useState, useRef, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import TypingIndicator from "./components/TypingIndicator.jsx";
import SuccessPage from "./pages/SuccessPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ChatMessage from "./components/ChatMessage.jsx";
import ProductCard from "./components/ProductCard.jsx";
import CartPage from "./pages/CartPage.jsx";
import SavedPage from "./pages/SavedPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ComparisonModal from "./components/ComparisonModal.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

const DEFAULT_MESSAGES = [];

const INITIAL_GREETING = "Hi! What product are you looking for today?";

const QUICK_PROMPTS = [
  "Best phone under ₹30,000",
  "Lightweight laptop for college",
  "Noise cancelling headphones",
  "Gaming keyboard with RGB",
];

function getInitialMessages() {
  try {
    const savedMessages = localStorage.getItem("chatMessages");
    if (!savedMessages) {
      return DEFAULT_MESSAGES;
    }

    const parsedMessages = JSON.parse(savedMessages);

    if (!Array.isArray(parsedMessages)) {
      return DEFAULT_MESSAGES;
    }

    if (
      parsedMessages.length === 1 &&
      parsedMessages[0]?.sender === "ai" &&
      parsedMessages[0]?.text === INITIAL_GREETING
    ) {
      return DEFAULT_MESSAGES;
    }

    return parsedMessages;
  } catch {
    return DEFAULT_MESSAGES;
  }
}

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : true;
  } catch {
    return true;
  }
}

function normalizeWebhookUrl(value) {
  const trimmedValue = readTextValue(value);

  if (!trimmedValue) {
    return "";
  }

  const withProtocol = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : /^\/\//.test(trimmedValue)
      ? `http:${trimmedValue}`
      : /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?(\/|$)/i.test(
          trimmedValue
        )
        ? `http://${trimmedValue}`
        : trimmedValue;

  try {
    new URL(withProtocol);
    return withProtocol;
  } catch {
    return "";
  }
}

const N8N_WEBHOOK_URL = normalizeWebhookUrl(
  import.meta.env.VITE_N8N_WEBHOOK_URL?.trim() ||
    __N8N_WEBHOOK_URL__ ||
    ""
);
const SESSION_STORAGE_KEY = "chatSessionId";

function createSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getOrCreateSessionId() {
  try {
    const existingSessionId = localStorage.getItem(SESSION_STORAGE_KEY);

    if (existingSessionId) {
      return existingSessionId;
    }

    const newSessionId = createSessionId();
    localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);

    return newSessionId;
  } catch {
    return createSessionId();
  }
}

function readTextValue(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return "";
}

function normalizeProduct(product, index) {
  if (!product || typeof product !== "object") {
    return null;
  }

  const name =
    readTextValue(product.name) ||
    readTextValue(product.title) ||
    readTextValue(product.productName) ||
    readTextValue(product.label) ||
    `Product ${index + 1}`;

  const priceSource =
    product.price ?? product.amount ?? product.cost ?? product.mrp ?? product.value;

  const price =
    typeof priceSource === "number"
      ? `₹${priceSource.toLocaleString("en-IN")}`
      : readTextValue(priceSource);

  const ratingSource = product.rating ?? product.stars ?? product.score;

  const rating =
    typeof ratingSource === "number"
      ? ratingSource.toFixed(1)
      : readTextValue(ratingSource);

  const image =
    readTextValue(product.image) ||
    readTextValue(product.imageUrl) ||
    readTextValue(product.thumbnail) ||
    readTextValue(product.picture) ||
    readTextValue(product.photo) ||
    "";

  const category =
    readTextValue(product.category) ||
    readTextValue(product.type) ||
    readTextValue(product.segment) ||
    "Electronics";

  return {
    ...product,
    name,
    price,
    rating,
    image,
    category,
  };
}

function normalizeN8nResponse(payload) {
  if (typeof payload === "string") {
    return {
      message: payload.trim() || "Here are some recommendations.",
      products: [],
    };
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const normalized = normalizeN8nResponse(item?.json ?? item);

      if (normalized.message !== "Here are some recommendations." || normalized.products.length > 0) {
        return normalized;
      }
    }

    return {
      message: "Here are some recommendations.",
      products: [],
    };
  }

  if (!payload || typeof payload !== "object") {
    return {
      message: "Here are some recommendations.",
      products: [],
    };
  }

  const messageKeys = [
    "message",
    "reply",
    "response",
    "text",
    "output",
    "answer",
    "content",
  ];

  let message = "";

  for (const key of messageKeys) {
    const text = readTextValue(payload[key]);

    if (text) {
      message = text;
      break;
    }
  }

  const productKeys = ["products", "items", "results", "recommendations"];
  let products = [];

  for (const key of productKeys) {
    const value = payload[key];

    if (Array.isArray(value)) {
      products = value
        .map((item, index) => normalizeProduct(item?.json ?? item, index))
        .filter(Boolean);
      break;
    }
  }

  if (!message || products.length === 0) {
    for (const nestedKey of ["json", "data", "body", "result", "output"]) {
      if (payload[nestedKey] !== undefined) {
        const nested = normalizeN8nResponse(payload[nestedKey]);

        if (nested.message !== "Here are some recommendations." || nested.products.length > 0) {
          return nested;
        }
      }
    }
  }

  return {
    message: message || "Here are some recommendations.",
    products,
  };
}

function HomePage({
  messages,
  loading,
  products,
  showComparison,
  setShowComparison,
  input,
  setInput,
  handleSend,
  handleVoiceSearch,
  composerRef,
  voiceStatus,
  voiceMessage,
  voiceTranscript,
}) {
  const visibleProducts = products;

  const isListening = voiceStatus === "listening";
  const hasVoiceFeedback =
    voiceStatus !== "idle" || voiceMessage || voiceTranscript;

  useEffect(() => {
    if (
      composerRef?.current &&
      document.activeElement !== composerRef.current
    ) {
      composerRef.current.focus();
    }
  }, [input, composerRef]);

  return (
    <main className="relative flex-1 overflow-hidden bg-[var(--app-bg)] text-[var(--app-text)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-[var(--app-spotlight-a)] blur-3xl" />
        <div className="absolute -left-10 bottom-10 h-96 w-96 rounded-full bg-[var(--app-spotlight-b)] blur-3xl" />
      </div>

      <div className="relative flex h-full flex-col">
        <header className="border-b border-[var(--app-border)] bg-[var(--app-surface)] px-6 py-5 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-6xl items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--app-text-muted)]">
                AI Shopping Assistant
              </p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
                Tell me what you need
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--app-text-muted)]">
                Ask in plain language, compare items, and move from discovery to
                checkout without leaving the chat.
              </p>
            </div>

            <div className="hidden rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-700 sm:flex dark:text-emerald-200">
              Voice search ready
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
            {messages.length === 0 && !loading && (
              <div className="rounded-3xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-[var(--app-text-muted)] shadow-lg shadow-black/5">
                <h2 className="text-lg font-semibold text-[var(--app-text)]">
                  Quick ideas
                </h2>
                <p className="mt-2 text-sm">
                  Try one of these prompts or type your own request.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setInput(prompt)}
                      className="rounded-full border border-[var(--app-border)] bg-[var(--app-primary-soft)] px-4 py-2 text-sm text-[var(--app-text)] transition hover:bg-[var(--app-primary-soft-hover)]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                sender={msg.sender}
                text={msg.text}
              />
            ))}

            {loading && <TypingIndicator />}

            {products.length >= 2 && (
              <button
                onClick={() => setShowComparison(true)}
                className="w-fit rounded-full border border-[var(--app-border)] bg-[var(--app-primary)] px-5 py-3 text-sm font-semibold text-[var(--app-primary-contrast)] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:opacity-95"
              >
                Compare Products
              </button>
            )}

            {visibleProducts.length > 0 && (
              <div className="grid grid-cols-1 gap-6 pt-2 lg:grid-cols-2">
                {visibleProducts.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {showComparison && (
          <ComparisonModal
            products={products.slice(0, 2)}
            onClose={() => setShowComparison(false)}
          />
        )}

        <footer className="border-t border-[var(--app-border)] bg-[var(--app-surface)] px-6 py-5 backdrop-blur-xl">
          <form
            className="mx-auto w-full max-w-6xl"
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
          >
            {hasVoiceFeedback && (
              <div className="mb-4 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 py-3 shadow-lg shadow-black/5">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${
                      voiceStatus === "error"
                        ? "bg-[var(--app-danger)]"
                        : isListening
                          ? "bg-[var(--app-success)] animate-pulse"
                          : "bg-[var(--app-success)]"
                    }`}
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--app-text)]">
                      {voiceStatus === "listening"
                        ? "Listening"
                        : voiceStatus === "captured"
                          ? "Voice captured"
                          : voiceStatus === "error"
                            ? "Voice input issue"
                            : "Voice ready"}
                    </p>

                    {voiceMessage ? (
                      <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                        {voiceMessage}
                      </p>
                    ) : null}

                    {voiceTranscript ? (
                      <p className="mt-1 truncate text-xs text-[var(--app-text-muted)]">
                        Recognized: “{voiceTranscript}”
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 rounded-[1.75rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-4 shadow-2xl shadow-black/10 md:flex-row md:items-end">
              <div className="flex-1">
                <label
                  className="sr-only"
                  htmlFor="shopping-prompt"
                >
                  Message
                </label>

                <textarea
                  id="shopping-prompt"
                  ref={composerRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask for products, compare items, or describe a budget..."
                  className="min-h-14 w-full resize-none bg-transparent px-1 py-1 text-base leading-6 text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-muted)]"
                />
              </div>

              <div className="flex items-center gap-3 md:pb-1">
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleVoiceSearch}
                  className={`inline-flex h-12 items-center gap-3 rounded-2xl border px-4 text-sm font-medium transition ${
                    isListening
                      ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100 shadow-lg shadow-emerald-500/10"
                      : "border-[var(--app-border)] bg-[var(--app-primary-soft)] text-[var(--app-text)] hover:bg-[var(--app-primary-soft-hover)]"
                  }`}
                  aria-label={
                    isListening ? "Stop voice input" : "Start voice input"
                  }
                >
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                      isListening
                        ? "bg-white text-slate-950"
                        : "bg-[var(--app-surface)] text-[var(--app-text)]"
                    }`}
                  >
                    {isListening ? "⏹" : "🎙"}
                  </span>

                  <span className="hidden sm:inline">
                    {isListening ? "Stop listening" : "Voice to text"}
                  </span>
                </button>

                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--app-primary)] px-6 font-semibold text-[var(--app-primary-contrast)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--app-text-muted)]">
              <span>Press Enter to send, Shift+Enter for a new line.</span>
              <span>{loading ? "Thinking..." : "Ready"}</span>
            </div>
          </form>
        </footer>
      </div>
    </main>
  );
}

export default function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState(() => getInitialMessages());
  const [products, setProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [darkMode, setDarkMode] = useState(() => getInitialTheme());
  const [voiceStatus, setVoiceStatus] = useState("idle");
  const [voiceMessage, setVoiceMessage] = useState("");
  const [voiceTranscript, setVoiceTranscript] = useState("");

  const composerRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceTimeoutRef = useRef(null);
  const sessionIdRef = useRef(getOrCreateSessionId());

  const shellClass = "min-h-screen flex bg-[var(--app-bg)] text-[var(--app-text)]";

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (voiceStatus === "captured") {
      const timeoutId = window.setTimeout(() => {
        setVoiceStatus("idle");
        setVoiceMessage("");
        setVoiceTranscript("");
      }, 2500);

      return () => window.clearTimeout(timeoutId);
    }

    if (voiceStatus === "error") {
      const timeoutId = window.setTimeout(() => {
        setVoiceStatus("idle");
        setVoiceMessage("");
      }, 4500);

      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
  }, [voiceStatus]);

  useEffect(() => {
    if (
      composerRef.current &&
      document.activeElement !== composerRef.current
    ) {
      composerRef.current.focus();
    }
  }, [input]);

  const clearVoiceTimer = () => {
    if (voiceTimeoutRef.current) {
      window.clearTimeout(voiceTimeoutRef.current);
      voiceTimeoutRef.current = null;
    }
  };

  const stopVoiceRecognition = () => {
    clearVoiceTimer();

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const resetVoiceFeedback = () => {
    setVoiceStatus("idle");
    setVoiceMessage("");
    setVoiceTranscript("");
  };

  const handleNewChat = () => {
    stopVoiceRecognition();

    sessionIdRef.current = createSessionId();

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, sessionIdRef.current);
    } catch {
      // Ignore storage failures and continue with the in-memory session ID.
    }

    localStorage.removeItem("chatMessages");
    setMessages(DEFAULT_MESSAGES);
    setProducts([]);
    setShowComparison(false);
    setInput("");
    setLoading(false);
    resetVoiceFeedback();

    if (composerRef.current) {
      composerRef.current.focus();
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus("error");
      setVoiceMessage("Voice input is not supported in this browser.");
      return;
    }

    if (voiceStatus === "listening" && recognitionRef.current) {
      stopVoiceRecognition();
      return;
    }

    const recognition = new SpeechRecognition();
    let latestTranscript = "";
    let encounteredError = false;

    recognition.lang = navigator.language || "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceStatus("listening");
      setVoiceMessage("Listening - speak now.");
      setVoiceTranscript("");
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }

      latestTranscript = transcript.trim();
      setInput(latestTranscript);
      setVoiceTranscript(latestTranscript);
      setVoiceMessage(
        latestTranscript ? `Heard: ${latestTranscript}` : "Listening - speak now."
      );
    };

    recognition.onerror = (event) => {
      encounteredError = true;
      clearVoiceTimer();

      const friendlyMessage =
        event.error === "not-allowed"
          ? "Microphone access was blocked."
          : event.error === "no-speech"
            ? "No speech was detected. Try again."
            : "Voice input stopped unexpectedly.";

      recognitionRef.current = null;
      setVoiceStatus("error");
      setVoiceMessage(friendlyMessage);
      setVoiceTranscript("");

      if (composerRef.current) {
        composerRef.current.focus();
      }
    };

    recognition.onend = () => {
      clearVoiceTimer();
      recognitionRef.current = null;

      if (encounteredError) {
        return;
      }

      if (latestTranscript) {
        setVoiceStatus("captured");
        setVoiceMessage(`Heard: ${latestTranscript}`);
      } else {
        setVoiceStatus("idle");
        setVoiceMessage("");
        setVoiceTranscript("");
      }

      if (composerRef.current) {
        composerRef.current.focus();
      }
    };

    try {
      recognitionRef.current = recognition;
      recognition.start();

      voiceTimeoutRef.current = window.setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 7000);
    } catch {
      clearVoiceTimer();
      recognitionRef.current = null;
      setVoiceStatus("error");
      setVoiceMessage("Unable to start voice input.");
      setVoiceTranscript("");
    }
  };

  const handleSend = async () => {
    stopVoiceRecognition();

    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const userInput = input;

    setInput("");
    setProducts([]);
    setShowComparison(false);
    setLoading(true);
    resetVoiceFeedback();

    if (!N8N_WEBHOOK_URL) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Set VITE_N8N_WEBHOOK_URL or N8N_WEBHOOK_URL in your .env file, then restart Vite.",
        },
      ]);

      setLoading(false);

      if (composerRef.current) {
        composerRef.current.focus();
      }

      return;
    }

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: userInput,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(
          data?.message || `n8n webhook returned ${response.status}`
        );
      }

      const normalizedResponse = normalizeN8nResponse(data);

      const aiMessage = {
        sender: "ai",
        text: normalizedResponse.message,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setProducts(normalizedResponse.products);
      setLoading(false);

      if (composerRef.current) {
        composerRef.current.focus();
      }

      return;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error connecting to the n8n webhook.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: errorMessage,
        },
      ]);

      setLoading(false);
      resetVoiceFeedback();
      setProducts([]);

      if (composerRef.current) {
        composerRef.current.focus();
      }
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className={shellClass}>
            <Sidebar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onNewChat={handleNewChat}
            />

            <HomePage
              composerRef={composerRef}
              messages={messages}
              loading={loading}
              products={products}
              showComparison={showComparison}
              setShowComparison={setShowComparison}
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              handleVoiceSearch={handleVoiceSearch}
              voiceStatus={voiceStatus}
              voiceMessage={voiceMessage}
              voiceTranscript={voiceTranscript}
            />
          </div>
        }
      />

      <Route
        path="/app"
        element={
          <div className={shellClass}>
            <Sidebar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onNewChat={handleNewChat}
            />

            <HomePage
              composerRef={composerRef}
              messages={messages}
              loading={loading}
              products={products}
              showComparison={showComparison}
              setShowComparison={setShowComparison}
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              handleVoiceSearch={handleVoiceSearch}
              voiceStatus={voiceStatus}
              voiceMessage={voiceMessage}
              voiceTranscript={voiceTranscript}
            />
          </div>
        }
      />

      <Route
        path="/cart"
        element={
          <div className={shellClass}>
            <Sidebar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onNewChat={handleNewChat}
            />

            <CartPage />
          </div>
        }
      />

      <Route
        path="/saved"
        element={
          <div className={shellClass}>
            <Sidebar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onNewChat={handleNewChat}
            />

            <SavedPage />
          </div>
        }
      />

      <Route
        path="/history"
        element={
          <div className={shellClass}>
            <Sidebar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onNewChat={handleNewChat}
            />

            <HistoryPage />
          </div>
        }
      />

      <Route
        path="/checkout"
        element={
          <div className={shellClass}>
            <Sidebar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onNewChat={handleNewChat}
            />

            <CheckoutPage />
          </div>
        }
      />

      <Route
        path="/success"
        element={
          <div className={shellClass}>
            <Sidebar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onNewChat={handleNewChat}
            />

            <SuccessPage />
          </div>
        }
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/signup"
        element={<SignupPage />}
      />
    </Routes>
  );
}