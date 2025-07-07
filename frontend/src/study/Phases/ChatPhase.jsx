import React, { useRef, useEffect, useState } from "react";
import ChatBubble from "./ChatBubble";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

const ChatPhase = ({ nextPhase, studyParams, studyData, setStudyData }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { role: "user", content: studyData.initialStatement }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const chatBoxRef = useRef(null);
  const initialFetchDone = useRef(false);


  // Scroll to bottom on new message (scroll the window, not the chat box)
  useEffect(() => {
    if (chatBoxRef.current) {
      // Scroll the last message into view
      const last = chatBoxRef.current.lastElementChild;
      if (last) last.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, aiLoading]);

  const isGroupB = studyParams?.group === "B";

  // On mount: set chat start timestamp and fetch initial AI message for both groups
  useEffect(() => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;
    
    // Set chat start timestamp
    setStudyData(prevData => ({ 
      ...prevData, 
      timestamps: {
        ...prevData.timestamps,
        chatStart: Date.now()
      }
    }));
    
    const fetchInitialAIMessage = async () => {
      setAiLoading(true);
      try {
        const endpoint = studyParams?.group === "B"
          ? "/study/group-b/start"
          : "/study/group-a/start";

        const requestBody = {
          thesis_id: studyParams.thesisId,
          initial_position: studyData.initialPosition,
          initial_statement: studyData.initialStatement,
        };

        // console.log("Sending Initial request:", requestBody);

        // Fetch initial AI message
        // Use the appropriate endpoint based on group
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        // Check for Recived message is in proper format
        const data = await res.json();
        if (data.role && data.content) {
setHistory((msgs) => [
  ...msgs,
  { role: data.role, content: data.content }
]);
        } else {
setHistory((msgs) => [
  ...msgs,
  { role: "error", content: "JSX error: Ungültiges Antwortformat vom Backend." }
]);
        }
      } catch {
setHistory((msgs) => [
  ...msgs,
  {
    role: "error",
    content: "JSX error: Fehler beim Abrufen der Antwort vom Backend.",
  },
]);
      }
      setAiLoading(false);
    };
    fetchInitialAIMessage();
  }, []);




  // Send user message (group B only)
  const sendMessage = async () => {
    // Don't send empty messages or if AI is already loading
    if (!input.trim() || aiLoading) return;

    // Add user message to state immediately and clear input (optimistic UI)
    setHistory(prev => [...prev, { role: "user", content: input }]);
    setInput("");
    setAiLoading(true);

    try {
      const requestBody = {
        thesis_id: studyParams.thesisId,
        initial_position: studyData.initialPosition,
        initial_statement: studyData.initialStatement,
        history: [...history, { role: "user", content: input }]
      };

      // console.log("Sending User message:", requestBody);

      const res = await fetch("/study/group-b/continue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (data.role && data.content) {
        setHistory(prev => [...prev, { role: data.role, content: data.content }]);
      } else {
        setHistory(prev => [...prev, { role: "error", content: "Ungültiges Antwortformat vom Backend." }]);
      }
    } catch {
      setHistory(prev => [...prev, { role: "error", content: "Fehler beim Abrufen der Antwort vom Backend." }]);
    }

    setAiLoading(false);
  };


  // Continue button enabled for group B after at least 6 messages in chat history
  const canContinue = isGroupB ? history.length >= 6 : true;


  return (
    <div className="min-h-screen bg-primary text-text-primary max-w-2xl mx-auto pt-2">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-40 px-5 max-w-2xl mx-auto">
        <div className="border-b border-color bg-primary pt-10 p-3">
          <div className="text-sm text-secondary pt-3 ">These: {studyData.thesisTitle || "..."}</div>
          <div className="text-lg font-semibold text-primary">{studyData.thesisText || "..."}</div>
        </div>
        {/* Bottom shadow gradient */}
        <div className="pointer-events-none h-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] to-transparent"></div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="py-32 px-8">
        <div
          ref={chatBoxRef}
          className="space-y-3 text-sm text-secondary"
        >
          
          {history.map((msg, i) => (
            <ChatBubble
              key={i}
              role={msg.role}
              content={msg.content}
            />
          ))}
          {aiLoading && (
            <ChatBubble text="" fromUser={false} isTyping />
          )}
        </div>
      </div>

      {/* Unified Fixed Footer */}
      <div className="fixed bottom-0 left-0 px-5 right-0 z-40">
        {/* Top shadow gradient */}
        <div className="pointer-events-none h-6 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent"></div>
        </div>
        <div className="max-w-2xl mx-auto pb-4 bg-primary">
          {isGroupB ? (
            <div className="flex items-end bg-secondary border border-color rounded-lg p-3">
              <textarea
                rows={1}
                placeholder="Deine Nachricht..."
                className="flex-grow resize-none overflow-auto bg-transparent text-primary focus:outline-none text-sm py-1 pl-1 min-h-[68px] max-h-32"
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={aiLoading}
              />
              <button
                className={`ml-2 bg-accent hover:bg-[var(--accent-color-secondary)] transition rounded-full px-4 py-2 text-white text-sm font-medium ${canContinue ? "cursor-pointer" : "opacity-40 cursor-default"
                  }`}
                onClick={() => {
                  setStudyData(prevData => ({ 
                    ...prevData, 
                    chatHistory: history,
                    timestamps: {
                      ...prevData.timestamps,
                      chatEnd: Date.now()
                    }
                  }));
                  nextPhase();
                }}
                disabled={!canContinue}
              >
                weiter
              </button>
              <button
                className={`ml-2 bg-accent hover:bg-[var(--accent-color-secondary)] transition rounded-full p-2 ${aiLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                onClick={sendMessage}
                disabled={aiLoading}
              >
                {/* Heroicons PaperAirplaneIcon */}
                <PaperAirplaneIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          ) : (
            <button
              className="bg-accent text-white px-4 py-2 rounded font-semibold hover:bg-[var(--accent-color-secondary)] transition ml-auto block cursor-pointer"
              onClick={() => {
                setStudyData(prevData => ({ 
                  ...prevData, 
                  chatHistory: history,
                  timestamps: {
                    ...prevData.timestamps,
                    chatEnd: Date.now()
                  }
                }));
                nextPhase();
              }}
            >
              weiter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPhase;
