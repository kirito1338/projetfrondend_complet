import React, { useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/helpers";

export default function ConversationModal({
  conversationOpen,
  setConversationOpen,
  selectedUser,
  userNames,
  conversation,
  newMessage,
  setNewMessage,
  fetchConversation,
  token,
  currentUserId
}) {
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (conversationOpen && conversation.length > 0) {
      const container = document.getElementById('conversation-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [conversation, conversationOpen]);

  if (!conversationOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-bold text-blue-700 mb-2">
          Discussion avec {userNames[selectedUser] || `Utilisateur #${selectedUser}`}
        </h2>
        
        <div className="h-64 overflow-y-auto border p-3 mb-3 bg-gray-50 rounded" id="conversation-container">
          {conversation.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Aucun message dans cette conversation</p>
            </div>
          ) : (
            conversation.map((msg) => {
              const isFromMe = msg.idExpediteur === currentUserId;
              const senderName = isFromMe ? "Vous" : (msg.nomExpediteur || `Utilisateur #${msg.idExpediteur}`);
              
              return (
                <div
                  key={msg.idMessage || msg.id || Math.random()}
                  className={`mb-2 p-2 rounded text-sm max-w-[80%] ${
                    isFromMe ? "bg-blue-100 ml-auto text-right" : "bg-gray-200"
                  }`}
                >
                  <p className="font-semibold text-xs text-gray-600 mb-1">{senderName}</p>
                  <p>{msg.contenu}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.dateEnvoi).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short"
                    })}
                  </p>
                </div>
              );
            })
          )}
        </div>

        <textarea
          rows="2"
          className="w-full border p-2 rounded mb-2"
          placeholder="Écrire une réponse..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />

        <div className="flex justify-between">
          <button
            onClick={() => setConversationOpen(false)}
            className="text-gray-600 hover:underline"
          >
            Fermer
          </button>

          <button
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            onClick={async () => {
              if (!newMessage.trim()) return;
              try {
                console.log("📤 Envoi message privé à l'utilisateur:", selectedUser, "contenu:", newMessage);
                await axios.post(`${API_URL}/api/messages/send_message_to_user/${selectedUser}`, {
                  contenu: newMessage
                }, axiosConfig);
                console.log("Message privé envoyé avec succès");
                setNewMessage("");
                await fetchConversation(selectedUser);
              } catch (err) {
                console.error("Erreur lors de l'envoi du message:", err);
                alert("Erreur lors de l'envoi du message.");
              }
            }}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
