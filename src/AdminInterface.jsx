import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaCar,
  FaEnvelope,
  FaCogs,
  FaSignOutAlt,
  FaReply,
} from "react-icons/fa";
import api from "./api";

export default function AdminInterface({ user, onLogout }) {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [stats, setStats] = useState({
    users: 0,
    drivers: 0,
    rides: 0,
    pendingRides: 0,
    support: 0,
  });
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [supportMessages, setSupportMessages] = useState([]);
  const [historyRides, setHistoryRides] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = historyRides.filter(
    (ride) =>
      ride.pointDepart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.pointArrivee.toLowerCase().includes(searchTerm.toLowerCase())
  );



  // Pour stocker la réponse écrite pour chaque message support
  const [replyTexts, setReplyTexts] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        switch (selectedSection) {
          case "dashboard":
            const statsRes = await api.get("/api/admin/stats");
            setStats(statsRes.data);
            break;
          case "users":
            const usersRes = await api.get("/api/users");
            setUsers(usersRes.data);
            break;
          case "trajets":
            const histoRes = await api.get("/api/admin/historique");
            setHistoryRides(histoRes.data);
            break;
          case "support":
            const supportRes = await api.get("/api/messages");
            setSupportMessages(supportRes.data);
            break;            
        }
      } catch (error) {
        console.error("Erreur:", error.response?.data || error.message);
      }
    };
    loadData();
  }, [selectedSection]);

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/api/users/${userId}`);
      setUsers(users.filter(u => u.id_user !== userId));
    } catch (error) {
      console.error("Erreur:", error.response?.data || error.message);
    }
  };

  const handleApproveRide = async (rideId) => {
  try {
    await api.put(`/api/admin/approve/${rideId}`);
    setRides(rides.filter(r => r.idTrajet !== rideId));
    setHistoryRides(prev =>
      prev.map(ride =>
        ride.idTrajet === rideId ? { ...ride, etat: "ouvert" } : ride
      )
    );
  } catch (error) {
    console.error("Erreur:", error.response?.data || error.message);
  }
};


const handleRejectRide = async (rideId) => {
  try {
    await api.put(`/api/admin/reject/${rideId}`);
    setRides(rides.filter(r => r.idTrajet !== rideId));
    setHistoryRides(prev =>
      prev.map(ride =>
        ride.idTrajet === rideId ? { ...ride, etat: "refusé" } : ride
      )
    );
  } catch (error) {
    console.error("Erreur:", error.response?.data || error.message);
  }
};



  // Met à jour la réponse tapée dans le textarea
  const handleChangeReply = (messageId, text) => {
    setReplyTexts(prev => ({ ...prev, [messageId]: text }));
  };

  // Envoie la réponse au support
  const handleSendReply = async (messageId) => {
    const response = replyTexts[messageId];
    if (!response || response.trim() === "") {
      alert("Veuillez écrire une réponse avant d'envoyer.");
      return;
    }
    try {
      await api.post(`/support/${messageId}/reply`, { response });
      setSupportMessages(supportMessages.map(msg =>
        msg.id === messageId ? { ...msg, replied: true } : msg
      ));
      // Vide la réponse locale
      setReplyTexts(prev => ({ ...prev, [messageId]: "" }));
    } catch (error) {
      console.error("Erreur:", error.response?.data || error.message);
      alert("Erreur lors de l'envoi de la réponse.");
    }
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">📊 Tableau de bord</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Trajets proposés" value={stats.rides} />
              <StatCard title="Utilisateurs inscrits" value={stats.users} />
              <StatCard title="Trajets à valider" value={stats.pendingRides} />
              <StatCard title="Demandes de support" value={stats.support} />
            </div>
          </div>
        );
      case "users":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">👥 Gestion des utilisateurs</h2>
            <div className="bg-white shadow rounded-lg p-4 space-y-3">
              {users.map(user => (
                <div key={user.id_user} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{user.first_name} {user.last_name}</p>
                    <p className="text-sm text-gray-500">{user.role_user}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
                      onClick={() => handleDeleteUser(user.id_user)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "support":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">📩 Support</h2>
            {supportMessages.length === 0 && <p>Aucun message pour l’instant.</p>}
            {supportMessages.map(msg => (
              <div key={msg.id} className="bg-white shadow p-4 rounded-lg space-y-2">
                <p className="font-medium">
                  {msg.author} • <span className="text-sm text-gray-500">{msg.date}</span>
                </p>
                <p>{msg.message}</p>
                {msg.replied ? (
                  <p className="text-green-600 font-semibold">✅ Répondu</p>
                ) : (
                  <div className="mt-2">
                    <textarea
                      className="border w-full p-2 rounded"
                      placeholder="Votre réponse..."
                      value={replyTexts[msg.id] || ""}
                      onChange={(e) => handleChangeReply(msg.id, e.target.value)}
                    />
                    <button
                      className="mt-2 flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      onClick={() => handleSendReply(msg.id)}
                    >
                      <FaReply /> Envoyer réponse
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
       case "trajets":
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🕓 Historique des trajets</h2>

      {/* 🔎 Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher par lieu de départ ou d’arrivée..."
        className="w-full p-2 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="bg-white shadow rounded-lg p-4 space-y-3">
        {filteredHistory.length === 0 ? (
          <p className="text-gray-500">Aucun trajet trouvé.</p>
        ) : (
          filteredHistory.map((ride) => (
            <div
              key={ride.idTrajet}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">
                  {ride.pointDepart} → {ride.pointArrivee}
                </p>
                <p className="text-sm text-gray-500">
                  {ride.date} • {ride.heureDepart}
                </p>
                <p className="text-sm">
                  État :{" "}
                  <span
                    className={`${
                      ride.etat === "refusé"
                        ? "text-red-600"
                        : ride.etat === "ouvert"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {ride.etat}
                  </span>
                </p>
              </div>
              <div className="space-x-2">
                {ride.etat === "refusé" && (
                  <button
                    className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700"
                    onClick={() => handleApproveRide(ride.idTrajet)}
                  >
                    Réapprouver
                  </button>
                )}
                {ride.etat === "ouvert" && (
                  <button
                    className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
                    onClick={() => handleRejectRide(ride.idTrajet)}
                  >
                    Rejeter
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col p-4 space-y-6">
        <h1 className="text-2xl font-bold">Admin - Covoiturage+</h1>
        <div className="text-sm mb-4">Connecté en tant que: {user?.email}</div>
        <nav className="flex flex-col space-y-2">
          <SidebarItem
            icon={<FaTachometerAlt />}
            label="Tableau de bord"
            onClick={() => setSelectedSection("dashboard")}
            active={selectedSection === "dashboard"}
          />
          <SidebarItem
            icon={<FaUsers />}
            label="Utilisateurs"
            onClick={() => setSelectedSection("users")}
            active={selectedSection === "users"}
          />
          <SidebarItem
            icon={<FaCar />}
            label="Trajets"
            onClick={() => setSelectedSection("trajets")}
            active={selectedSection === "trajets"}
          />
          <SidebarItem
            icon={<FaEnvelope />}
            label="Support"
            onClick={() => setSelectedSection("support")}
            active={selectedSection === "support"}
          />    
          <SidebarItem
            icon={<FaSignOutAlt />}
            label="Déconnexion"
            onClick={onLogout}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function SidebarItem({ icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded transition-all ${
        active ? "bg-blue-600" : "hover:bg-blue-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
