import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function Dashboard({ trajets, messages }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl mb-4 animate-pulse">
          🚗 Bienvenue Conducteur 👋
        </h2>
        <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { 
            label: "Total Trajets", 
            value: trajets.length, 
            icon: "🚗", 
            gradient: "from-cyan-500/20 to-blue-600/20",
            border: "border-cyan-400/30",
            glow: "shadow-cyan-500/25"
          },
          { 
            label: "Messages Reçus", 
            value: messages.length, 
            icon: "💬", 
            gradient: "from-purple-500/20 to-pink-600/20",
            border: "border-purple-400/30",
            glow: "shadow-purple-500/25"
          },
          { 
            label: "Prochains Trajets", 
            value: trajets.filter(t => new Date(t.date) >= new Date()).length, 
            icon: "📅", 
            gradient: "from-emerald-500/20 to-teal-600/20",
            border: "border-emerald-400/30",
            glow: "shadow-emerald-500/25"
          },
        ].map((item, i) => (
          <div 
            key={i} 
            className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            <div className={`relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl border ${item.border} ${item.glow} shadow-2xl text-center overflow-hidden`}>
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 group-hover:animate-ping"></div>
              
              <div className="text-6xl mb-4 group-hover:animate-bounce">{item.icon}</div>
              
              <h3 className="text-xl text-white/90 font-bold uppercase tracking-wider mb-3 group-hover:text-white transition-colors">
                {item.label}
              </h3>
              
              <p className="text-5xl font-black text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                {item.value}
              </p>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              🗺️ Carte Interactive de Montréal
            </h3>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent z-10 pointer-events-none"></div>
            
            <MapContainer 
              center={[45.5017, -73.5673]} 
              zoom={12} 
              style={{ height: "100%", width: "100%" }}
              className="rounded-2xl"
            >
              <TileLayer 
                attribution='&copy; OpenStreetMap' 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
              />
              <Marker position={[45.5017, -73.5673]}>
                <Popup className="font-bold">
                  🏠 Départ depuis Montréal
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-60"></div>
        </div>
      </div>
    </div>
  );
}
