import React from "react";
import SuccessToast from "../components/SuccessToast";

export default function Messages({
  messages,
  userNames,
  fetchConversation,
  messageForm,
  setMessageForm,
  trajets,
  handleEnvoyerMessageForm,
  successToast
}) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 bg-clip-text text-transparent drop-shadow-2xl mb-4">
          💬 Centre de Messages
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-500 mx-auto rounded-full animate-pulse"></div>
        <p className="text-white/70 mt-4 text-lg">Communication avec vos passagers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: "Messages Reçus", 
            value: messages.length, 
            icon: "📨", 
            gradient: "from-blue-500/20 to-cyan-600/20",
            border: "border-blue-400/30"
          },
          { 
            label: "Conversations", 
            value: new Set(messages.map(m => m.idExpediteur)).size, 
            icon: "👥", 
            gradient: "from-purple-500/20 to-pink-600/20",
            border: "border-purple-400/30"
          },
          { 
            label: "Trajets Actifs", 
            value: trajets.length, 
            icon: "🚗", 
            gradient: "from-green-500/20 to-emerald-600/20",
            border: "border-green-400/30"
          }
        ].map((stat, i) => (
          <div key={i} className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <div className={`relative bg-white/10 backdrop-blur-lg p-6 rounded-2xl border ${stat.border} shadow-2xl text-center`}>
              <div className="text-4xl mb-3 group-hover:animate-bounce">{stat.icon}</div>
              <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
              <div className="text-sm text-white/70 uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              📨 Messages Reçus
              <span className="text-sm bg-blue-500/20 px-3 py-1 rounded-full">{messages.length}</span>
            </h3>

            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4 opacity-50">📭</div>
                  <p className="text-white/60 text-lg">Aucun message reçu</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className="relative group/msg">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-blue-500/5 rounded-2xl opacity-0 group-hover/msg:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white">
                            {(msg.nomExpediteur || userNames[msg.idExpediteur])
                              ? (msg.nomExpediteur || userNames[msg.idExpediteur]).charAt(0).toUpperCase()
                              : '👤'
                            }
                          </div>
                          <div>
                            <p className="font-bold text-white">
                              {msg.nomExpediteur || userNames[msg.idExpediteur] || `Utilisateur #${msg.idExpediteur}`}
                            </p>
                            <p className="text-xs text-white/60">
                              {msg.dateEnvoi 
                                ? new Date(msg.dateEnvoi).toLocaleString("fr-FR", {
                                    dateStyle: "short",
                                    timeStyle: "short"
                                  })
                                : msg.date
                              }
                            </p>
                          </div>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>

                      <div className="bg-white/5 p-3 rounded-xl mb-3">
                        <p className="text-white/90">{msg.contenu || msg.message}</p>
                      </div>

                      {msg.reponse && (
                        <div className="bg-green-500/10 border border-green-400/20 p-3 rounded-xl mb-3">
                          <p className="text-sm text-green-400 font-semibold mb-1">Votre réponse :</p>
                          <p className="text-green-300">{msg.reponse}</p>
                        </div>
                      )}

                      <button
                        onClick={() => fetchConversation(msg.idExpediteur)}
                        disabled={!msg.idExpediteur}
                        className="group/btn relative px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                        <span className="relative z-10 flex items-center gap-2">
                          <span>💬</span>
                          <span>Répondre</span>
                        </span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              ✉️ Envoyer un Message
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-white/90 font-bold mb-3 flex items-center gap-2">
                  🚗 Sélectionner un trajet
                </label>
                <select
                  className="w-full bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-green-400/50 focus:bg-white/20 transition-all duration-300"
                  value={messageForm.trajetId}
                  onChange={e =>
                    setMessageForm({
                      ...messageForm,
                      trajetId: parseInt(e.target.value, 10),
                      destinataireUserId: ""
                    })
                  }
                >
                  <option value="" className="bg-gray-800">-- Envoyer à tous les passagers d'un trajet --</option>
                  {trajets.map(t => (
                    <option key={t.idTrajet} value={t.idTrajet} className="bg-gray-800">
                      🗺️ {t.pointDepart} → {t.pointArrivee}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/90 font-bold mb-3 flex items-center gap-2">
                  💭 Votre message
                </label>
                <textarea
                  className="w-full bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-green-400/50 focus:bg-white/20 transition-all duration-300 resize-none"
                  rows="4"
                  placeholder={
                    messageForm.destinataireUserId
                      ? `Répondre à l'utilisateur #${messageForm.destinataireUserId}...`
                      : "Écrivez votre message ici..."
                  }
                  value={messageForm.contenu}
                  onChange={e => setMessageForm({ ...messageForm, contenu: e.target.value })}
                />
              </div>

              <button
                onClick={handleEnvoyerMessageForm}
                className="group relative w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-500 transform hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-2xl">🚀</span>
                  <span>Envoyer le Message</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <SuccessToast successToast={successToast} />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3B82F6, #8B5CF6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563EB, #7C3AED);
        }
      `}</style>
    </div>
  );
}
