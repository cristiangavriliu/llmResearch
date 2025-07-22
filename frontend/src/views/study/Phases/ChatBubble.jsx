import React from "react";

/**
 * ChatBubble component that matches the original iFrame styling.
 * @param {string} role - "user", "assistant", or "error"
 * @param {string} content - The message text.
 * @param {boolean} isTyping - True for the typing indicator.
 */
const ChatBubble = ({ role, content, isTyping }) => {
  // Typing indicator with 3 bouncing dots
  if (isTyping) {
    return (
      <div className="flex justify-start">
        <div className="inline-flex items-center bg-secondary text-primary px-3 py-3 rounded-2xl text-sm">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-[var(--text-primary)] rounded-full animate-bounce [animation-delay:.1s]"></span>
            <span className="w-1.5 h-1.5 bg-[var(--text-primary)] rounded-full animate-bounce [animation-delay:.3s]"></span>
            <span className="w-1.5 h-1.5 bg-[var(--text-primary)] rounded-full animate-bounce [animation-delay:.5s]"></span>
          </div>
        </div>
      </div>
    );
  }

  // Error message with red styling
  if (role === "error") {
    return (
      <div className="flex justify-start">
        <div className="max-w-2xl bg-red-100 border border-red-300 text-red-800 p-3 rounded-2xl text-sm break-words">
          <div className="font-semibold mb-1 flex items-center gap-2">
            Verbindungsfehler
          </div>
          <div className="prose prose-sm whitespace-pre-line">
            Es ist ein Fehler aufgetreten, bitte versuchen Sie es erneut. Oder falls der Fehler bestehen bleibt, melden Sie den Fehler der Studienleitung.
          </div>
        </div>
      </div>
    );
  }

  // User or assistant bubble
  const fromUser = role === "user";
  return (
    <div className={`flex ${fromUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          ${fromUser
            ? "max-w-[66%] bg-accent text-white"
            : "max-w-2xl bg-secondary text-primary"
          }
          p-3 rounded-2xl text-sm break-words
        `}
      >
        <div className="font-semibold mb-1">{fromUser ? "Du" : "KI"}</div>
        <div className="prose prose-sm whitespace-pre-line">
          {content}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
