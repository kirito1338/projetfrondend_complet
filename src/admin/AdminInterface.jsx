import React, { useState } from "react";
import { FaArrowLeft, FaCrown } from "react-icons/fa";
import api from "../api";

// Import styles
import "./styles/AdminInterface.css";

// Import components
import Sidebar from "./components/Sidebar";

// Import pages
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import RideManagement from "./pages/RideManagement";
import SupportManagement from "./pages/SupportManagement";

// Import hooks
import useAdminData from "./hooks/useAdminData";

export default function AdminInterface({ user, onLogout }) {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [replyTexts, setReplyTexts] = useState({});
  const [userSearch, setUserSearch] = useState("");

  // Use the custom hook to get data
  const {
    stats,
    users,
    rides,
    supportMessages,
    historyRides,
    setUsers,
    setSupportMessages,
    setHistoryRides,
    setRides
  } = useAdminData(selectedSection);

  // Handler functions
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
        return <Dashboard stats={stats} />;
      
      case "users":
        return (
          <UserManagement
            users={users}
            userSearch={userSearch}
            setUserSearch={setUserSearch}
            handleDeleteUser={handleDeleteUser}
          />
        );
      
      case "trajets":
        return (
          <RideManagement
            historyRides={historyRides}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleApproveRide={handleApproveRide}
            handleRejectRide={handleRejectRide}
          />
        );
      
      case "support":
        return (
          <SupportManagement
            supportMessages={supportMessages}
            replyTexts={replyTexts}
            handleChangeReply={handleChangeReply}
            handleSendReply={handleSendReply}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-layout admin-fade-in">
        <Sidebar
          user={user}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          onLogout={onLogout}
        />

        {/* Main Content */}
        <main className="admin-main">
          {/* Header Section */}
          <div className="admin-header">
            <div className="admin-breadcrumb">
              <FaCrown className="admin-breadcrumb-icon" />
              <span className="admin-breadcrumb-separator">›</span>
              <span>Interface Administrateur</span>
              <span className="admin-breadcrumb-separator">›</span>
              <span style={{ color: '#ffd700', fontWeight: '600' }}>
                {selectedSection === 'dashboard' && 'Tableau de Bord'}
                {selectedSection === 'users' && 'Gestion Utilisateurs'}
                {selectedSection === 'trajets' && 'Gestion Trajets'}
                {selectedSection === 'support' && 'Support Client'}
              </span>
            </div>
            <h1 className="admin-header-title">
              {selectedSection === 'dashboard' && '📊 Tableau de Bord'}
              {selectedSection === 'users' && '👥 Gestion Utilisateurs'}
              {selectedSection === 'trajets' && '🚗 Gestion Trajets'}
              {selectedSection === 'support' && '💬 Support Client'}
            </h1>
          </div>

          {/* Back Button */}
          <a
            href="/"
            className="admin-back-button"
          >
            <FaArrowLeft className="admin-back-button-icon" />
            <span>Retour à l'accueil</span>
          </a>

          {/* Content */}
          <div className="admin-content-area">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
