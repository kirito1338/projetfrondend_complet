import React from "react";

const ReservationCard = ({ reservation }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">
            {reservation.pointDepart} → {reservation.pointArrivee}
          </h3>
          <p className="text-sm text-gray-600">
            Conducteur: #{reservation.idConducteur}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
          Réservé
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Date:</span>
          <span className="ml-2 font-medium">{reservation.date}</span>
        </div>
        <div>
          <span className="text-gray-600">Heure:</span>
          <span className="ml-2 font-medium">{reservation.heureDepart}</span>
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;
