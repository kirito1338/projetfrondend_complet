import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaCar,
  FaEnvelope,
  FaSignOutAlt,
  FaCrown,
  FaUserShield,
} from "react-icons/fa";
import SidebarItem from "./SidebarItem";

export default function Sidebar({ user, selectedSection, setSelectedSection, onLogout }) {
  // Fonction pour obtenir les initiales de l'utilisateur
  const getUserInitials = (user) => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "AD";
  };

  return (
    <aside className="admin-sidebar">
      {/* User Info Section */}
      <div className="admin-user-info">
        <div className="admin-user-avatar">
          {getUserInitials(user)}
        </div>
        <div className="admin-user-name">
          {user?.first_name && user?.last_name 
            ? `${user.first_name} ${user.last_name}`
            : user?.email || "Admin"
          }
        </div>
        <div className="admin-user-role">
          <FaCrown style={{ marginRight: '0.5rem' }} />
          Administrateur
        </div>
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul className="admin-nav">
          <li className="admin-nav-item">
            <button
              className={`admin-nav-button ${selectedSection === "dashboard" ? "active" : ""}`}
              onClick={() => setSelectedSection("dashboard")}
            >
              <FaTachometerAlt className="admin-nav-icon" />
              <span>Tableau de bord</span>
            </button>
          </li>
          <li className="admin-nav-item">
            <button
              className={`admin-nav-button ${selectedSection === "users" ? "active" : ""}`}
              onClick={() => setSelectedSection("users")}
            >
              <FaUsers className="admin-nav-icon" />
              <span>Utilisateurs</span>
            </button>
          </li>
          <li className="admin-nav-item">
            <button
              className={`admin-nav-button ${selectedSection === "trajets" ? "active" : ""}`}
              onClick={() => setSelectedSection("trajets")}
            >
              <FaCar className="admin-nav-icon" />
              <span>Trajets</span>
            </button>
          </li>
          <li className="admin-nav-item">
            <button
              className={`admin-nav-button ${selectedSection === "support" ? "active" : ""}`}
              onClick={() => setSelectedSection("support")}
            >
              <FaEnvelope className="admin-nav-icon" />
              <span>Support</span>
            </button>
          </li>
        </ul>

        {/* Logout Button */}
        <button
          className="admin-logout-button"
          onClick={onLogout}
        >
          <FaSignOutAlt style={{ marginRight: '0.5rem' }} />
          <span>Déconnexion</span>
        </button>
      </nav>
    </aside>
  );
}
