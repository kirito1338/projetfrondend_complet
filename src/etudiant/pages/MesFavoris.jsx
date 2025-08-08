import React from "react";
import { FaHeart } from "react-icons/fa";
import TrajetCard from "../components/TrajetCard";
import EmptyState from "../components/EmptyState";

const MesFavoris = ({ favoris, onReserver, onFavoris }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      <div className="bg-gradient-to-r from-pink-600 to-rose-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Mes Favoris
            </h1>
            <p className="text-xl text-pink-100 max-w-2xl mx-auto">
              Retrouvez tous vos trajets préférés sauvegardés
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Trajets favoris
              </h2>
              <p className="text-gray-600">
                Accès rapide à vos trajets préférés
              </p>
            </div>
            {favoris.length > 0 && (
              <div className="text-sm text-gray-500">
                {favoris.length} favori{favoris.length > 1 ? "s" : ""}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {favoris.length === 0 ? (
              <EmptyState
                icon={FaHeart}
                title="Aucun favori"
                description="Ajoutez des trajets à vos favoris pour les retrouver facilement ici."
              />
            ) : (
              favoris.map((trajet, index) => (
                <div key={trajet.idTrajet || index}>
                  <TrajetCard
                    trajet={trajet}
                    onReserver={() => onReserver(trajet.idTrajet)}
                    onFavoris={() => onFavoris(trajet)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesFavoris;
