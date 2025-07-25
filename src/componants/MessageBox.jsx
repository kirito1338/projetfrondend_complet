import { X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api";

const MessageBox = ({ message, onClose }) => {
  const [reply, setReply] = useState("");
  const [conversation, setConversation] = useState([]);
  const isReplyable = !!message?.idExpediteur;

  const getCurrentUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user_id;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await api.get(`/api/messages/with/${message.idExpediteur}`);
        const mapped = res.data.map((msg) => ({
          ...msg,
          estMoi: msg.id_expediteur === currentUserId,
        }));
        setConversation(mapped);
      } catch (err) {
        console.error("Erreur chargement conversation :", err);
      }
    };

    if (isReplyable && currentUserId) {
      fetchConversation();
    }
  }, [message]);

  const handleReply = async () => {
    if (!reply.trim() || !isReplyable) return;

    try {
      await api.post(`/api/messages/send_message_to_user/${message.idExpediteur}`, {
        contenu: reply,
      });

      setReply("");

      const res = await api.get(`/api/messages/with/${message.idExpediteur}`);
      const mapped = res.data.map((msg) => ({
        ...msg,
        estMoi: msg.id_expediteur === currentUserId,
      }));
      setConversation(mapped);
    } catch (err) {
      console.error("Erreur d'envoi :", err);
      alert("Erreur lors de l'envoi");
    }
  };

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white shadow-lg border rounded-lg p-4 z-[9999] max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-green-700">
          Discussion avec utilisateur {message.idExpediteur}
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          <X />
        </button>
      </div>

      {/* ✅ Conversation */}
      <div className="space-y-2 mb-3 max-h-64 overflow-y-auto">
        {conversation.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded text-sm max-w-[80%] ${
              msg.estMoi
                ? "bg-green-100 ml-auto text-right"
                : "bg-gray-200 mr-auto"
            }`}
          >
            <div>{msg.contenu}</div>
            <div className="text-xs text-gray-500">
              {new Date(msg.date_envoi).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Réponse */}
      <textarea
        className="w-full p-2 border rounded text-sm"
        placeholder="Votre réponse..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />

      <button
        onClick={handleReply}
        className="mt-2 bg-green-600 text-white py-1.5 px-4 rounded hover:bg-green-700 w-full text-sm"
      >
        Envoyer
      </button>
    </div>
  );
};

export default MessageBox;
