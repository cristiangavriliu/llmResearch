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
  const chatContainerRef = useRef(null);
  const thesisTextRef = useRef(null);
  const [isOneLine, setIsOneLine] = useState(true);
  const initialFetchDone = useRef(false);


  // Scroll to bottom on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history, aiLoading]);

  const isGroupB = studyParams?.group === "B";

  useEffect(() => {
    if (!thesisTextRef.current) return;
    const el = thesisTextRef.current;
    const style = window.getComputedStyle(el);
    const lineHeight = parseFloat(style.lineHeight);
    const height = el.offsetHeight;
    setIsOneLine(height <= lineHeight + 2);
  }, [studyData.thesisText]);

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

    fetchInitialAIMessage();
  }, []);

  // Function to fetch initial AI message
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
        prolific_pid: studyData.prolificPid
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
          { role: "error", content: `Ungültiges Antwortformat vom Backend. Erhaltene Daten: ${JSON.stringify(data)}` }
        ]);
      }
    } catch (error) {
      setHistory((msgs) => [
        ...msgs,
        {
          role: "error",
          content: `Fehler: ${error.message}`,
        },
      ]);
    }
    setAiLoading(false);
  };

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
        prolific_pid: studyData.prolificPid,
        history: [...history, { role: "user", content: input }].map(msg =>
          msg.role === "error"
            ? { role: "assistant", content: `[ERROR] ${msg.content}` }
            : msg
        )
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
        setHistory(prev => [...prev, { role: "error", content: `Ungültiges Antwortformat vom Backend. Erhaltene Daten: ${JSON.stringify(data)}` }]);
      }
    } catch (error) {
      setHistory(prev => [...prev, { role: "error", content: `Fehler: ${error.message}` }]);
    }

    setAiLoading(false);
  };


  // Continue button enabled for group B after at least 6 messages in chat history
  const canContinue = isGroupB ? history.length >= 6 : history.length >= 2;


  return (
    <>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <div className="max-w-2xl mx-auto border-b border-color bg-primary py-4 px-8 pt-12">
          <div className="text-sm text-secondary">These: {studyData.thesisTitle || "..."}</div>
          <div
            className="text-lg font-semibold text-primary"
            ref={thesisTextRef}
          >
            {studyData.thesisText || "..."}
          </div>
        </div>
        {/* Bottom shadow gradient */}
        <div className="pointer-events-none h-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] to-transparent"></div>
        </div>
      </div>

      {/* Chat Messages - Full width container for proper scrollbar positioning */}
      <div
        ref={chatContainerRef}
        className={`bg-primary h-screen overflow-y-auto scrollbar-hide scroll-smooth ${isOneLine ? "pt-32" : "pt-40"} pb-32`}
      >
        <div
          ref={chatBoxRef}
          className="max-w-2xl mx-auto px-4 space-y-3 text-sm text-secondary"
        >
          {history.map((msg, i) => (
            <ChatBubble
              key={i}
              role={msg.role}
              content={msg.content}
              isGroupB={isGroupB}
            />
          ))}
          {aiLoading && (
            <ChatBubble role="assistant" content="" isTyping isGroupB={isGroupB} />
          )}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        {/* Top shadow gradient */}
        <div className="pointer-events-none h-6 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent"></div>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-4 bg-primary">
          {isGroupB ? (
            <div className={`flex items-end bg-secondary border border-color rounded-lg p-3 ${aiLoading ? "cursor-not-allowed" : ""
              }`}>
              <textarea
                rows={1}
                placeholder="Deine Nachricht..."
                className={`flex-grow resize-none overflow-auto bg-transparent text-primary focus:outline-none text-sm py-1 pl-1 min-h-[68px] max-h-32 ${aiLoading ? "cursor-not-allowed" : ""
                  }`}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={aiLoading}
                onCopy={e => e.preventDefault()}
                onPaste={e => e.preventDefault()}
              />
              <button
                className={`ml-2 bg-accent hover:bg-[var(--accent-color-secondary)] transition rounded-full px-4 py-2 text-white text-sm font-medium ${canContinue && !aiLoading
                  ? "cursor-pointer"
                  : "opacity-40 cursor-not-allowed"
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
                disabled={!canContinue || aiLoading}
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
            <div className="flex justify-end gap-2">
              {/* Only show retry button if last message was an error */}
              {history.length > 0 && history[history.length - 1].role === "error" && (
                <button
                  className={`bg-accent text-white px-4 py-2 rounded font-semibold hover:bg-[var(--accent-color-secondary)] transition ${!aiLoading
                    ? "cursor-pointer"
                    : "opacity-40 cursor-not-allowed"
                    }`}
                  onClick={fetchInitialAIMessage}
                  disabled={aiLoading}
                >
                  Antwort erneut generieren
                </button>
              )}
              <button
                className={`bg-accent text-white px-4 py-2 rounded font-semibold hover:bg-[var(--accent-color-secondary)] transition ${history.length >= 2 && !aiLoading
                  ? "cursor-pointer"
                  : "opacity-40 cursor-not-allowed"
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
                disabled={history.length < 2 || aiLoading}
              >
                weiter
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPhase;
