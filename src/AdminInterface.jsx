import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaCar,
  FaEnvelope,
  FaSignOutAlt,
  FaReply,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaTrash,
  FaRoute,
  FaUser,
  FaArrowLeft,
  FaUserFriends,
  FaExclamationTriangle,
  FaClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckDouble,
} from "react-icons/fa";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import api from "./api";

// Carte Google Maps centrée sur Montréal
function MontrealMapCard() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBo_o1KoYrdYgDbPkR2e0uwj5qrXUSeOwE", // <-- Remplace par ta clé API
  });
  const center = { lat: 45.5017, lng: -73.5673 }; // Montréal

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center w-full max-w-5xl mx-auto">
      <h3 className="text-lg font-semibold mb-2">Localisation : Montréal</h3>
      <div className="w-full h-[500px] rounded-lg overflow-hidden">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={12}
          >
            <Marker position={center} />
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">Chargement de la carte...</div>
        )}
      </div>
    </div>
  );
}

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
  const [replyTexts, setReplyTexts] = useState({});
  const [userSearch, setUserSearch] = useState(""); // Ajoute ce state

  const filteredHistory = historyRides.filter(
    (ride) =>
      ride.pointDepart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.pointArrivee.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            console.log(supportRes.data); // <--- Ajoute ceci pour voir la vraie clé
            const onlyAdminMessages = supportRes.data.filter(
              msg => msg.idDestinataire === 9
            );
            setSupportMessages(onlyAdminMessages);
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

  const handleChangeReply = (messageId, text) => {
    setReplyTexts(prev => ({ ...prev, [messageId]: text }));
  };

 const handleSendReply = async (messageId) => {
    const response = replyTexts[messageId];
    if (!response || response.trim() === "") {
      alert("Veuillez écrire une réponse avant d'envoyer.");
      return;
    }
    // On cherche le message par idMessage (clé unique dans ta structure)
    const msg = supportMessages.find(m => m.idMessage === messageId);
    if (!msg) {
      alert("Message non trouvé.");
      return;
    }
    try {
      await api.post(`api/messages/send_message_to_user/${msg.idExpediteur}`, {
        contenu: response
      });
      setSupportMessages(supportMessages.map(m =>
        m.idMessage === messageId ? { ...m, replied: true } : m
      ));
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
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaTachometerAlt className="text-blue-600" /> Tableau de bord
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Trajets proposés" value={stats.rides} icon={<FaRoute />} />
              <StatCard title="Utilisateurs inscrits" value={stats.users} icon={<FaUsers />} />
              <StatCard title="Trajets à valider" value={stats.pendingRides} icon={<FaExclamationTriangle />} />
              <StatCard title="Demandes de support" value={stats.support} icon={<FaEnvelope />} />
            </div>
            {/* Carte Google Maps Montréal */}
            <div className="max-w-xl mx-auto">
              <MontrealMapCard />
            </div>
          </div>
        );
      case "users":
  // Filtrage des utilisateurs selon la recherche
  const filteredUsers = users.filter(
    user =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearch.toLowerCase())
  );
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <FaUsers className="text-blue-600" /> Gestion des utilisateurs
      </h2>
      <input
        type="text"
        placeholder="Rechercher un utilisateur par nom..."
        className="w-full p-2 border rounded"
        value={userSearch}
        onChange={e => setUserSearch(e.target.value)}
      />
      <div className="bg-white shadow rounded-lg p-4 space-y-3">
        {filteredUsers.length === 0 ? (
          <p className="text-gray-500">Aucun utilisateur trouvé.</p>
        ) : (
          filteredUsers.map(user => (
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
                  <FaTrash className="inline mr-1" /> Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
      case "support":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaEnvelope className="text-blue-600" /> Support
            </h2>
            {supportMessages.length === 0 && <p>Aucun message pour l’instant.</p>}
           {supportMessages.map(msg => (
              <div key={msg.idMessage} className="bg-white shadow p-4 rounded-lg space-y-2">
                <p className="font-medium">
                  {msg.expediteur || msg.nomExpediteur || msg.author || "Expéditeur inconnu"} •{" "}
                  <span className="text-sm text-gray-500">{msg.date}</span>
                </p>
                <p>{msg.message || msg.contenu || msg.texte || <span className="text-gray-400">[Pas de contenu]</span>}</p>
                {msg.replied ? (
                  <p className="text-green-600 font-semibold flex items-center gap-1"><FaCheckDouble /> Répondu</p>
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
      case "trajets":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaCar className="text-blue-600" /> Historique des trajets
            </h2>
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
                      <p className="font-medium flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        {ride.pointDepart}
                        <FaRoute className="text-blue-500" />
                        {ride.pointArrivee}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FaCalendarAlt /> {ride.date} <FaClock /> {ride.heureDepart}
                      </p>
                      <p className="text-sm">
                        État :{" "}
                        <span
                          className={`${
                            ride.etat === "refusé"
                              ? "text-red-600"
                              : ride.etat === "ouvert"
                              ? "text-green-600"
                              : ride.etat === "en attente"
                              ? "text-yellow-600"
                              : ""
                          }`}
                        >
                          {ride.etat}
                        </span>
                      </p>
                    </div>
                    <div className="space-x-2">
                      {ride.etat === "en attente" && (
                        <button
                          className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700"
                          onClick={() => handleApproveRide(ride.idTrajet)}
                        >
                          <FaCheckCircle className="inline mr-1" /> Approuver
                        </button>
                      )}
                      {ride.etat === "refusé" && (
                        <button
                          className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700"
                          onClick={() => handleApproveRide(ride.idTrajet)}
                        >
                          <FaCheckCircle className="inline mr-1" /> Réapprouver
                        </button>
                      )}
                      {ride.etat === "ouvert" && (
                        <button
                          className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
                          onClick={() => handleRejectRide(ride.idTrajet)}
                        >
                          <FaTimesCircle className="inline mr-1" /> Rejeter
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
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-800 font-bold text-lg">🚗</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">CovoituragePlus</h1>
              <p className="text-blue-200 text-sm">Administration</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-blue-200">
            Connecté en tant que: {user?.email}
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
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
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Retour accueil */}
        <div className="mb-6">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <FaArrowLeft />
            <span>Retour à l'accueil</span>
          </button>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center flex flex-col items-center">
      <div className="mb-2 text-2xl text-blue-600">{icon}</div>
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function SidebarItem({ icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded transition-all w-full ${
        active ? "bg-blue-600 shadow-lg" : "hover:bg-blue-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}