export default function ChatMessage({ sender, text }) {
  return (
    <div
      className={`p-4 rounded-2xl max-w-xl ${
        sender === "user"
          ? "bg-white text-black ml-auto"
          : "bg-[#1f1f1f]"
      }`}
    >
      {text}
    </div>
  );
}