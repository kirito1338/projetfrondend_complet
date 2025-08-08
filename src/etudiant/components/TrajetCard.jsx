import React from "react";
import {
  FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUserFriends, FaHeart, FaUser
} from "react-icons/fa";

const TrajetCard = ({ trajet, onReserver, onFavoris }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {trajet.pointDepart} → {trajet.pointArrivee}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaUser className="text-blue-400" />
              <span>Conducteur #{trajet.idConducteur}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {trajet.prix || "?"}$
            </div>
            <div className="text-sm text-gray-500">par personne</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaMapMarkerAlt className="text-blue-500" />
            <div>
              <div className="text-sm text-gray-500">Départ</div>
              <div className="font-semibold text-gray-900">{trajet.pointDepart}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaMapMarkerAlt className="text-green-500" />
            <div>
              <div className="text-sm text-gray-500">Arrivée</div>
              <div className="font-semibold text-gray-900">{trajet.pointArrivee}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaCalendarAlt className="text-purple-500" />
            <div>
              <div className="text-sm text-gray-500">Date</div>
              <div className="font-semibold text-gray-900">{trajet.date}</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <FaClock className="text-blue-500" />
              <span>{trajet.heureDepart}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaUserFriends className="text-green-500" />
              <span>{trajet.placesDisponibles} places</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={onFavoris} 
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <FaHeart className="text-xl" />
            </button>
            <button 
              onClick={onReserver} 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              Réserver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrajetCard;
