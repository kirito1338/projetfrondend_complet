import React from "react";
import { Navigation, MapPin, MessageCircle, Calendar, Clock } from "lucide-react";

export default function TripDetails({ 
  selectedTrajet, 
  handleDialogOpen, 
  setMessageBoxData, 
  handleReservation 
}) {
  if (!selectedTrajet) return null;

  return (
    <div className="mb-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/40 p-8 hover:bg-white/95 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-2xl font-semibold text-gray-900 flex items-center">
            <Navigation className="w-6 h-6 mr-3 text-blue-600" />
            Trip Details
          </h4>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium shadow-sm">
            Selected
          </span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/40">
              <h5 className="font-semibold text-gray-900 mb-4">Route Information</h5>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <span className="text-sm text-gray-600">From</span>
                    <p className="font-medium text-gray-900">{selectedTrajet.pointDepart}</p>
                  </div>
                </div>
                <div className="ml-1.5 w-0.5 h-8 bg-gray-300"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <span className="text-sm text-gray-600">To</span>
                    <p className="font-medium text-gray-900">{selectedTrajet.pointArrivee}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/40">
              <h5 className="font-semibold text-gray-900 mb-4">Schedule</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Date</span>
                    <p className="font-medium text-gray-900">{selectedTrajet.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Time</span>
                    <p className="font-medium text-gray-900">{selectedTrajet.heureDepart}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>   
          <div className="space-y-4">
            <button
              onClick={handleDialogOpen}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
            >
              <MapPin className="w-5 h-5" />
              <span>View Route on Map</span>
            </button>

            <button
              onClick={() =>
                setMessageBoxData({
                  idExpediteur: selectedTrajet.idConducteur,
                })
              }
              className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contact Driver</span>
            </button>

            <button
              onClick={() => handleReservation(selectedTrajet.idTrajet)}
              className="w-full px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
            >
              <span className="text-lg">🛎️</span>
              <span>Réserver ce trajet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
