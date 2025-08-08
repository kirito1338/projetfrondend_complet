import React from "react";
import { Car, Calendar, Clock, User } from "lucide-react";

export default function TripCard({ 
  trajet, 
  index, 
  selectedTrajet, 
  setSelectedTrajet, 
  calculateRoute 
}) {
  const isSelected = selectedTrajet?.id === trajet.idTrajet;

  return (
    <div
      key={trajet.idTrajet || index}
      className={`p-6 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-102 ${
        isSelected
          ? 'border-blue-500 bg-blue-50/80 backdrop-blur-sm shadow-lg scale-102' 
          : 'border-gray-200 bg-white/70 backdrop-blur-sm hover:border-gray-300 hover:bg-white/90'
      }`}
      onClick={() => {
        setSelectedTrajet(trajet);
        calculateRoute(trajet);
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <Car className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-600">Trip #{trajet.idTrajet}</span>
        </div>
        {trajet.prix && (
          <span className="text-lg font-bold text-green-600">{trajet.prix}</span>
        )}
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-900 font-medium text-sm">{trajet.pointDepart}</span>
        </div>
        <div className="ml-1.5 w-0.5 h-6 bg-gray-300"></div>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-900 font-medium text-sm">{trajet.pointArrivee}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{trajet.date}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{trajet.heureDepart}</span>
        </div>
      </div>
      
      {trajet.conducteur && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-gray-700 text-sm font-medium">{trajet.conducteur}</span>
        </div>
      )}
    </div>
  );
}
