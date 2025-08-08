import React from "react";

export default function Header({ section, setSection, token, handleLogout }) {
  const menuItems = [
    { key: "accueil", label: "🏠 Accueil", gradient: "from-cyan-400 to-blue-500" },
    { key: "proposer", label: "➕ Proposer", gradient: "from-green-400 to-emerald-500" },
    { key: "trajets", label: "🗺️ Trajets", gradient: "from-purple-400 to-pink-500" },
    { key: "messages", label: "💬 Messages", gradient: "from-orange-400 to-red-500" },
    { key: "parametres", label: "⚙️ Paramètres", gradient: "from-indigo-400 to-purple-500" }
  ];

  return (
    <header className="relative">
      <div className="bg-white/5 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/25 animate-pulse">
                <span className="text-2xl">🚗</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg opacity-30 animate-ping"></div>
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
              VroomVroom
            </h1>
          </div>

          <nav className="flex items-center space-x-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`group relative px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                  section === item.key
                    ? "bg-white/20 text-white shadow-lg backdrop-blur-lg border border-white/30"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm`}></div>
                
                <span className="relative z-10">{item.label}</span>
                
                {section === item.key && (
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r ${item.gradient} rounded-full animate-pulse`}></div>
                )}
              </button>
            ))}
            
            {token && (
              <button
                onClick={handleLogout}
                className="group relative ml-4 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                
                <span className="relative z-10 flex items-center space-x-2">
                  <span>🚪</span>
                  <span>Déconnexion</span>
                </span>
              </button>
            )}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-60 animate-pulse"></div>
      </div>
    </header>
  );
}
