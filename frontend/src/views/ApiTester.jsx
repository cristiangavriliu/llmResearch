// API Tester Page with improved, consistent layout

import React, { useState, useRef, useEffect } from "react";
import { theses } from "../data/theses";
import ChatBubble from "./study/Phases/ChatBubble";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";


// Helper to get thesis by id (id is number)
const getThesisById = (id) => theses.find(t => t.id === id);

const ApiTester = () => {
  // Form state
  const [thesisId, setThesisId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [position, setPosition] = useState(50);
  const [statement, setStatement] = useState("");
  const [chatStarted, setChatStarted] = useState(false);

  // Chat state
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // For scroll-to-bottom in chat
  const chatContainerRef = useRef(null);
  const chatBoxRef = useRef(null);

  // Get selected thesis object
  const thesis = getThesisById(Number(thesisId));

  // Handlers
  const handleThesisSelect = (e) => setThesisId(e.target.value);
  const handleApiKey = (e) => setApiKey(e.target.value);
  const handleModel = (e) => setModel(e.target.value);
  const handlePosition = (e) => setPosition(Number(e.target.value));
  const handleStatement = (e) => setStatement(e.target.value);

  // Chat send handler
  const sendMessage = async () => {
    if (!input.trim() || aiLoading) return;
    setChatHistory(prev => [...prev, { role: "user", content: input }]);
    setInput("");
    setAiLoading(true);

    try {
      const payload = {
        thesis_id: Number(thesisId),
        api_key: apiKey,
        model,
        initial_position: position,
        initial_statement: statement,
        history: [...chatHistory, { role: "user", content: input }]
      };
      const res = await fetch("/api-tester/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.role && data.content) {
        setChatHistory(prev => [...prev, { role: data.role, content: data.content }]);
      } else {
        setChatHistory(prev => [
          ...prev,
          { role: "error", content: "Ungültiges Antwortformat vom Backend." }
        ]);
      }
    } catch {
      setChatHistory(prev => [
        ...prev,
        { role: "error", content: "Fehler beim Abrufen der Antwort vom Backend." }
      ]);
    }
    setAiLoading(false);
  };

  // Start chat handler
  const handleStartChat = async () => {
    setChatStarted(true);
    setChatHistory([{ role: "user", content: statement }]);
    setAiLoading(true);
    try {
      const payload = {
        thesis_id: Number(thesisId),
        api_key: apiKey,
        model,
        initial_position: position,
        initial_statement: statement,
        history: [{ role: "user", content: statement }]
      };
      const res = await fetch("/api-tester/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.role && data.content) {
        setChatHistory(prev => [...prev, { role: data.role, content: data.content }]);
      } else {
        setChatHistory(prev => [
          ...prev,
          { role: "error", content: "Ungültiges Antwortformat vom Backend." }
        ]);
      }
    } catch {
      setChatHistory(prev => [
        ...prev,
        { role: "error", content: "Fehler beim Abrufen der Antwort vom Backend." }
      ]);
    }
    setAiLoading(false);
  };

  // Scroll chat to bottom on new message (scroll only the chat container, not the window)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory, aiLoading]);

  // Validation for enabling chat
  const canStartChat =
    thesisId &&
    apiKey.trim() &&
    model.trim() &&
    statement.trim().length >= 50;

  // Render chat phase as root-level fragment, input phase in container
  return chatStarted ? (
    <>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <div className="max-w-2xl mx-auto border-b border-color bg-primary py-4 px-8 pt-12">
          <div className="text-sm text-secondary">These: {thesis ? thesis.title : "---"}</div>
          <div className="text-lg font-semibold text-primary min-h-[2lh]">{thesis ? thesis.text : "---"}</div>
        </div>
        {/* Bottom shadow gradient */}
        <div className="pointer-events-none h-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] to-transparent"></div>
        </div>
      </div>

      {/* Chat Messages - Full width container for proper scrollbar positioning */}
      <div 
        ref={chatContainerRef}
        className="bg-primary h-screen overflow-y-auto scrollbar-hide scroll-smooth pt-32 pb-32"
      >
        <div
          ref={chatBoxRef}
          className="max-w-2xl mx-auto px-4 space-y-3 text-sm text-secondary"
        >
          {chatHistory.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} content={msg.content} />
          ))}
          {aiLoading && (
            <ChatBubble isTyping />
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
          <div className={`flex items-end bg-secondary border border-color rounded-lg p-3 ${aiLoading ? "cursor-not-allowed" : ""}`}>
            <textarea
              rows={1}
              placeholder="Deine Nachricht..."
              className={`flex-grow resize-none overflow-auto bg-transparent text-primary focus:outline-none text-sm py-1 pl-1 min-h-[68px] max-h-32 ${aiLoading ? "cursor-not-allowed" : ""}`}
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={aiLoading}
            />
            <button
              className={`ml-2 bg-accent hover:bg-[var(--accent-color-secondary)] transition rounded-full p-2 ${aiLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
              onClick={sendMessage}
              disabled={!input.trim() || aiLoading}
            >
              <PaperAirplaneIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="bg-primary text-text-primary min-h-screen max-w-2xl py-9 px-5 mx-auto">
      {/* Thesis display always on top */}
      <div className="mb-4 p-3">
        <div className="text-sm text-secondary">
          These: {thesis ? thesis.title : "---"}
        </div>
        <div className="text-lg font-semibold text-primary min-h-[2lh]">
          {thesis ? thesis.text : "---"}
        </div>
      </div>

      {/* Thesis selector always visible */}
      <div className="mb-4">
        <label className="block font-semibold text-base mb-1 px-1">These auswählen</label>
        <div className="relative">
          <select
            className="appearance-none w-full border border-color rounded-lg p-3 text-primary bg-secondary transition pr-10 text-base focus:outline-none"
            value={thesisId}
            onChange={handleThesisSelect}
            style={{ boxShadow: "none" }}
          >
            <option value="">Bitte wählen...</option>
            {theses.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>

      {/* API Key */}
      <div className="mb-4">
        <label className="block font-semibold text-base mb-1 px-1">API Key</label>
        <input
          type="text"
          className="w-full border border-color rounded-lg p-3 text-primary bg-secondary text-base"
          value={apiKey}
          onChange={handleApiKey}
          placeholder="API Key eingeben"
        />
      </div>
      {/* Model */}
      <div className="mb-4">
        <label className="block font-semibold text-base mb-1 px-1">Model</label>
        <div className="relative">
          <select
            className="appearance-none w-full border border-color rounded-lg p-3 text-primary bg-secondary transition pr-10 text-base focus:outline-none"
            value={model}
            onChange={handleModel}
          >
            <option value="">Bitte wählen...</option>
            <option value="gpt-4-turbo">gpt-4-turbo</option>
            <option value="gpt-4o">gpt-4o</option>
            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
      {/* Position Card */}
      <div className="border border-color rounded-lg p-6 bg-secondary text-primary mt-6">
        <label htmlFor="initial-position" className="block text-base mb-1 px-1">
          Wie stehen Sie zu dieser These? (<span>{position}</span>/100):
        </label>
        <input
          type="range"
          id="initial-position"
          min={0}
          max={100}
          value={position}
          onChange={handlePosition}
          className="w-full appearance-none bg-[var(--text-secondary)] h-2 rounded"
        />
        <div className="flex justify-between text-sm text-secondary">
          <span>stimme überhaupt nicht zu</span>
          <span>stimme voll und ganz zu</span>
        </div>
      </div>

      {/* Statement Card */}
        <label htmlFor="initial-statement" className="block font-semibold text-base mb-1 px-1 mt-6">
          Ihre Meinung zur These:
        </label>
        <textarea
          id="initial-statement"
          rows={5}
          className="w-full bg-secondary border border-color p-3 rounded text-primary focus:outline-none resize-none placeholder-[var(--text-secondary)] text-base"
          placeholder="Begründen Sie Ihre Position zu dieser These ausführlich ... (min. 50 Zeichen)"
          value={statement}
          onChange={handleStatement}
        />
      {/* Start Chat Button */}
      {!chatStarted && (
        <button
          onClick={handleStartChat}
          disabled={!canStartChat}
          className={`bg-accent hover:bg-[var(--accent-color-secondary)] text-white px-4 py-2 rounded font-semibold transition ml-auto block mt-6 ${
            canStartChat ? "cursor-pointer" : "opacity-40 cursor-default"
          }`}
        >
          Diskussion starten
        </button>
      )}
    </div>
  );
};

export default ApiTester;
