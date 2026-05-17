export default function TypingIndicator() {

  return (
    <div className="bg-[#1f1f1f] p-4 rounded-2xl max-w-fit">

      <div className="flex gap-2">

        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>

        <div
          className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>

        <div
          className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>

      </div>

    </div>
  );
}
