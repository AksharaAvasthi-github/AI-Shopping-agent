export default function ChatMessage({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-2xl rounded-3xl px-5 py-4 shadow-lg ${
          isUser
            ? "border border-[var(--app-border)] bg-[var(--app-user-bubble-bg)] text-[var(--app-user-bubble-text)]"
            : "border border-[var(--app-border)] bg-[var(--app-ai-bubble-bg)] text-[var(--app-ai-bubble-text)] backdrop-blur"
        }`}
      >
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--app-text-muted)]">
          {isUser ? "You" : "AI Assistant"}
        </div>

        <p className="whitespace-pre-wrap text-sm leading-6 sm:text-[15px]">
          {text}
        </p>
      </div>
    </div>
  );
}