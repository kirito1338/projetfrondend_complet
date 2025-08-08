import React from "react";
import {
  FaCar,
  FaMapMarkerAlt,
  FaRoute,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function RideManagement({ 
  historyRides, 
  searchTerm, 
  setSearchTerm, 
  handleApproveRide, 
  handleRejectRide 
}) {
  const filteredHistory = historyRides.filter(
    (ride) =>
      ride.pointDepart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.pointArrivee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <FaCar className="text-blue-600" /> Historique des trajets
      </h2>
      <input
        type="text"
        placeholder="Rechercher par lieu de départ ou d'arrivée..."
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
}
