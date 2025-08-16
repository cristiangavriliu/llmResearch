import React from "react";
import ReactMarkdown from "react-markdown";

/**
 * ChatBubble component that matches the original iFrame styling.
 * @param {string} role - "user", "assistant", or "error"
 * @param {string} content - The message text.
 * @param {boolean} isTyping - True for the typing indicator.
 * @param {boolean} isGroupB - Whether the user is in group B
 */
const ChatBubble = ({ role, content, isTyping, isGroupB = false }) => {
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
            {isGroupB
              ? "Ein Fehler ist aufgetreten. Bitte versuchen Sie erneut, eine Nachricht zu senden. Wenn das Problem weiterhin besteht, klicken Sie nach drei Nachrichten auf „weiter“ um die daten abzuspeichern und melden Sie es der Studienleitung nach abschluss der Studie"
              : "Ein Fehler ist aufgetreten. Klicken Sie auf „Antwort erneut generieren“. Falls weiterhin keine Antwort erscheint, klicken Sie auf „weiter“ um die daten abzuspeichern und informieren Sie die Studienleitung nach abschluss der Studie."}
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
        <div className="prose prose-sm prose-headings:mt-2 prose-headings:mb-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
