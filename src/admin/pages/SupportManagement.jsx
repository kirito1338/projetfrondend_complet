import React from "react";
import { FaEnvelope, FaReply, FaCheckDouble } from "react-icons/fa";

export default function SupportManagement({ 
  supportMessages, 
  replyTexts, 
  handleChangeReply, 
  handleSendReply 
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <FaEnvelope className="text-blue-600" /> Support
      </h2>
      {supportMessages.length === 0 && <p>Aucun message pour l'instant.</p>}
      {supportMessages.map(msg => (
        <div key={msg.idMessage} className="bg-white shadow p-4 rounded-lg space-y-2">
          <p className="font-medium">
            {msg.expediteur || msg.nomExpediteur || msg.author || "Expéditeur inconnu"} •{" "}
            <span className="text-sm text-gray-500">{msg.date}</span>
          </p>
          <p>{msg.message || msg.contenu || msg.texte || <span className="text-gray-400">[Pas de contenu]</span>}</p>
          {msg.replied ? (
            <p className="text-green-600 font-semibold flex items-center gap-1">
              <FaCheckDouble /> Répondu
            </p>
          ) : (
            <div className="mt-2">
              <textarea
                className="border w-full p-2 rounded"
                placeholder="Votre réponse..."
                value={replyTexts[msg.idMessage] || ""}
                onChange={(e) => handleChangeReply(msg.idMessage, e.target.value)}
              />
              <button
                className="mt-2 flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                onClick={() => handleSendReply(msg.idMessage)}
              >
                <FaReply /> Envoyer réponse
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
