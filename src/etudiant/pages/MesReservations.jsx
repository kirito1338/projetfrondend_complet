import React from "react";
import { FaHistory } from "react-icons/fa";
import ReservationCard from "../components/ReservationCard";
import EmptyState from "../components/EmptyState";

const MesReservations = ({ reservations }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Mes Réservations
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Gérez et suivez toutes vos réservations de trajets
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Toutes mes réservations
              </h2>
              <p className="text-gray-600">
                Historique complet de vos trajets réservés
              </p>
            </div>
            {reservations.length > 0 && (
              <div className="text-sm text-gray-500">
                {reservations.length} réservation{reservations.length > 1 ? "s" : ""}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {reservations.length === 0 ? (
              <EmptyState
                icon={FaHistory}
                title="Aucune réservation"
                description="Vous n'avez pas encore effectué de réservation. Commencez par rechercher un trajet !"
              />
            ) : (
              reservations.map((reservation, idx) => (
                <ReservationCard 
                  key={reservation.idTrajet || idx} 
                  reservation={reservation} 
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesReservations;
