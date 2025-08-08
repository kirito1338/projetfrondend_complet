import React, { useState } from "react";
import { Send } from "lucide-react";
import api from "../api";

const ContactAdmin = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await api.post("/api/messages/send_message_to_user/9", {
        contenu: message,
        });
      setSent(true);
    } catch (err) {
      alert("Erreur lors de l'envoi du message.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-green-700 mb-2 flex items-center gap-2">
          <Send /> Contacter l'Admin
        </h2>
        <p className="text-gray-600 mb-6">
          Une question, un bug ou une suggestion ? Écris-nous, l’équipe admin te répondra vite !
        </p>
        {sent ? (
          <div className="text-center text-green-700 font-semibold text-lg py-8">
             Message envoyé avec succès !<br />Merci pour ton retour.
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <textarea
              className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-green-400 transition resize-none min-h-[100px] text-gray-800"
              placeholder="Écris ton message ici..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin mr-2">⏳</span>
              ) : (
                <Send size={18} />
              )}
              Envoyer
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactAdmin;