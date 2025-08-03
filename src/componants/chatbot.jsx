import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X } from "lucide-react";
import api from "../api";

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Bonjour ! Posez-moi une question sur le covoiturage ou la plateforme." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/api/chatbot/ask", { question: userMsg.text });
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: res.data.answer || "Désolé, je n'ai pas compris." }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Erreur lors de la connexion au serveur." }
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) handleSend();
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 w-80 max-w-full bg-white rounded-xl shadow-2xl border border-blue-200 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-blue-600 rounded-t-xl">
        <div className="flex items-center gap-2 text-white font-bold">
          <MessageCircle /> Chatbot
        </div>
        <button onClick={onClose} className="text-white hover:text-red-200">
          <X />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 350 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg shadow text-sm ${
                msg.from === "user"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center border-t p-2 bg-gray-50">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded border focus:outline-none"
          placeholder="Votre question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2"
          disabled={loading}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;