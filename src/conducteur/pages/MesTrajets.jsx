import React from "react";

export default function MesTrajets({ trajets, handleModifier, handleSupprimer }) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-red-600 bg-clip-text text-transparent drop-shadow-2xl mb-4">
          🗺️ Mes Trajets
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-500 mx-auto rounded-full animate-pulse"></div>
        <p className="text-white/70 mt-4 text-lg">Gérez tous vos trajets en un coup d'œil</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: trajets.length, icon: "📊", color: "from-blue-500 to-cyan-500" },
          { label: "Actifs", value: trajets.filter(t => t.etat === 'actif').length, icon: "🟢", color: "from-green-500 to-emerald-500" },
          { label: "Approuvés", value: trajets.filter(t => t.approuve).length, icon: "✅", color: "from-purple-500 to-violet-500" },
          { label: "En attente", value: trajets.filter(t => !t.approuve).length, icon: "⏳", color: "from-orange-500 to-red-500" }
        ].map((stat, i) => (
          <div key={i} className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-20 rounded-2xl blur-lg group-hover:opacity-40 transition-opacity duration-300`}></div>
            <div className="relative bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/20 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {trajets.length === 0 ? (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-slate-600/20 rounded-3xl blur-xl opacity-50"></div>
          <div className="relative bg-white/10 backdrop-blur-lg p-12 rounded-3xl border border-white/20 shadow-2xl text-center">
            <div className="text-8xl mb-6 opacity-50">🚗</div>
            <h3 className="text-2xl font-bold text-white/80 mb-4">Aucun trajet pour le moment</h3>
            <p className="text-white/60 text-lg">Commencez par proposer votre premier trajet !</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {trajets.map(t => {
            const heureClean = t.heureDepart?.includes(" ")
              ? t.heureDepart.split(" ")[1]
              : t.heureDepart;
            const fullDate = `${t.date}T${heureClean}`;
            const isValidDate = !isNaN(new Date(fullDate));

            const isApproved = t.approuve;
            const isActive = t.etat === 'actif';
            const statusConfig = {
              gradient: isApproved 
                ? 'from-green-500/20 to-emerald-600/20' 
                : 'from-orange-500/20 to-red-600/20',
              border: isApproved 
                ? 'border-green-400/30' 
                : 'border-orange-400/30',
              glow: isApproved 
                ? 'shadow-green-500/25' 
                : 'shadow-orange-500/25'
            };

            return (
              <div key={t.idTrajet} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r ${statusConfig.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className={`relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl border ${statusConfig.border} ${statusConfig.glow} shadow-2xl overflow-hidden`}>
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">🚗</div>
                        <div>
                          <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                            <span className="text-green-400">📍</span>
                            {t.pointDepart}
                            <span className="text-blue-400 mx-2">→</span>
                            <span className="text-red-400">🎯</span>
                            {t.pointArrivee}
                          </h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                          <div className="text-white/70 mb-1">📅 Date & Heure</div>
                          <div className="text-white font-bold">
                            {isValidDate
                              ? new Date(fullDate).toLocaleString("fr-FR", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })
                              : "Non défini"}
                          </div>
                        </div>
                        
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                          <div className="text-white/70 mb-1">👥 Places</div>
                          <div className="text-white font-bold text-xl">{t.placesDisponibles}</div>
                        </div>
                        
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                          <div className="text-white/70 mb-1">⚡ État</div>
                          <div className={`font-bold ${isActive ? 'text-green-400' : 'text-orange-400'}`}>
                            {isActive ? '🟢 Actif' : '🟡 Inactif'}
                          </div>
                        </div>
                        
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                          <div className="text-white/70 mb-1">✅ Statut</div>
                          <div className={`font-bold ${isApproved ? 'text-green-400' : 'text-orange-400'}`}>
                            {isApproved ? '✅ Approuvé' : '⏳ En attente'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleModifier(t)}
                        className="group relative px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative z-10 flex items-center gap-2">
                          <span>✏️</span>
                          <span>Modifier</span>
                        </span>
                      </button>
                      
                      <button
                        onClick={() => handleSupprimer(t.idTrajet)}
                        className="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative z-10 flex items-center gap-2">
                          <span>🗑️</span>
                          <span>Supprimer</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
