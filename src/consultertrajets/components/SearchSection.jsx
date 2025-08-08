import React from "react";
import { Autocomplete } from "@react-google-maps/api";
import { Search, MapPin } from "lucide-react";
import { useLang } from "../../LangContext";

export default function SearchSection({
  addressDepart,
  setAddressDepart,
  onAutocompleteLoad,
  onAutocompletePlaceChanged,
  filterTrajetsByDepart,
  isSearching
}) {
  const { t } = useLang();
  
  return (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/40 p-8 hover:shadow-2xl hover:bg-white/95 transition-all duration-300">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
            <Search className="w-6 h-6 mr-3 text-blue-600" />
            {t("rechercherTrajetsDisponibles")}
          </h2>
          <p className="text-gray-600">{t("entrerLieuDepart")}</p>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            {window.google && (
              <Autocomplete
                onLoad={onAutocompleteLoad}
                onPlaceChanged={onAutocompletePlaceChanged}
              >
                <input
                  type="text"
                  value={addressDepart}
                  onChange={(e) => setAddressDepart(e.target.value)}
                  placeholder={t("entrerAdresseDepart")}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </Autocomplete>
            )}
            {!window.google && (
              <input
                type="text"
                value={addressDepart}
                onChange={(e) => setAddressDepart(e.target.value)}
                placeholder="Enter departure address (e.g., Casablanca, Morocco)"
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            )}
          </div>
          <button
            onClick={filterTrajetsByDepart}
            disabled={isSearching}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
          >
            {isSearching ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t("recherche")}...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>{t("rechercher")} {t("trajets")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
