import React from "react";
import { FaSearch } from "react-icons/fa";
import { useLang } from "../../LangContext";
import SearchBar from "../components/SearchBar";
import TrajetCard from "../components/TrajetCard";
import EmptyState from "../components/EmptyState";

const RechercheTrajet = ({ 
  searchParams, 
  setSearchParams, 
  trajets, 
  onSearch, 
  onReserver, 
  onFavoris 
}) => {
  const { t } = useLang();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-800 py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {t("trouverTrajetIdeal")}
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            {t("voyagerSecurite")}
          </p>
        </div>
      </div>

      <div className="relative -mt-16 px-4 sm:px-6 lg:px-8 mb-16">
        <SearchBar
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          onSearch={onSearch}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Trajets disponibles
              </h2>
              <p className="text-gray-600">
                Trouvez le trajet parfait pour votre voyage
              </p>
            </div>
            {trajets.length > 0 && (
              <div className="text-sm text-gray-500">
                {trajets.length} trajet{trajets.length > 1 ? "s" : ""} trouvé{trajets.length > 1 ? "s" : ""}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {trajets.length === 0 ? (
              <EmptyState
                icon={FaSearch}
                title="Aucun trajet trouvé"
                description="Essayez de modifier vos critères de recherche pour trouver plus de trajets."
              />
            ) : (
              trajets.map((trajet, index) => (
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

export default RechercheTrajet;
