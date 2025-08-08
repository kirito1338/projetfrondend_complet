import React from "react";
import { Route } from "lucide-react";
import TripCard from "../components/TripCard";

export default function TripList({ 
  trajets, 
  filteredTrajets, 
  hasSearched, 
  handleTrajetSelection, 
  selectedTrajet, 
  setSelectedTrajet, 
  calculateRoute 
}) {
  const displayTrajets = hasSearched ? filteredTrajets : trajets;

  if (displayTrajets.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/40 p-8 hover:bg-white/95 transition-all duration-300">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Route className="w-6 h-6 mr-3 text-green-600" />
          {hasSearched
            ? `Available Trips (${filteredTrajets.length})`
            : `All Available Trips (${trajets.length})`}
        </h3>
        
        <div className="space-y-4">
          <select 
            onChange={handleTrajetSelection}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
          >
            <option value="">Select a trip to view details</option>
            {displayTrajets.map((trajet, index) => (
              <option key={index} value={index}>
                {trajet.pointDepart} → {trajet.pointArrivee} ({trajet.date} at {trajet.heureDepart})
              </option>
            ))}
          </select>
          
          {displayTrajets.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
              {displayTrajets.map((trajet, index) => (
                <TripCard
                  key={trajet.idTrajet || index}
                  trajet={trajet}
                  index={index}
                  selectedTrajet={selectedTrajet}
                  setSelectedTrajet={setSelectedTrajet}
                  calculateRoute={calculateRoute}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
