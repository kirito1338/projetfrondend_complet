import React from "react";
import {
  FaSearch, FaHistory, FaHeart, FaUser, FaSignOutAlt, FaArrowLeft
} from "react-icons/fa";

const Navigation = ({ selectedSection, setSelectedSection, onLogout }) => {
  const menuItems = [
    { id: "recherche", label: "Recherche", icon: FaSearch },
    { id: "reservations", label: "Mes réservations", icon: FaHistory },
    { id: "favoris", label: "Favoris", icon: FaHeart },
    { id: "profil", label: "Mon profil", icon: FaUser },
  ];

  return (
    <>
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Interface Étudiant</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSection(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      selectedSection === item.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
            >
              <FaSignOutAlt />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="md:hidden bg-white border-t">
        <div className="flex justify-around py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedSection(item.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg ${
                  selectedSection === item.id
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                <Icon className="text-lg" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => window.location.href = '/'}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110"
      >
        <FaArrowLeft />
      </button>
    </>
  );
};

export default Navigation;
