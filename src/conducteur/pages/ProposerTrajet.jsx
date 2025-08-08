import React from "react";
import { Autocomplete, GoogleMap, DirectionsRenderer } from "@react-google-maps/api";

export default function ProposerTrajet({
  editTrajet,
  formTrajet,
  setFormTrajet,
  departAutocompleteRef,
  arriveeAutocompleteRef,
  directions,
  calculateRoute,
  handleAjouterTrajet
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-black bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent drop-shadow-2xl mb-4">
          {editTrajet ? "✏️ Modifier un trajet" : "➕ Proposer un trajet"}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-teal-500 mx-auto rounded-full animate-pulse"></div>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-2xl">
          {window.google && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <label className="block text-white/90 font-bold mb-2 flex items-center gap-2">
                    🏁 Point de départ
                  </label>
                  <Autocomplete
                    onLoad={(autocomplete) => (departAutocompleteRef.current = autocomplete)}
                    onPlaceChanged={() => {
                      const place = departAutocompleteRef.current?.getPlace();
                      if (place && place.formatted_address) {
                        setFormTrajet((prev) => ({ ...prev, depart: place.formatted_address }));
                      }
                    }}
                  >
                    <input 
                      type="text" 
                      placeholder="Sélectionnez votre point de départ..." 
                      value={formTrajet.depart}
                      onChange={(e) => setFormTrajet({ ...formTrajet, depart: e.target.value })}
                      className="w-full bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:border-green-400/50 focus:bg-white/20 transition-all duration-300 font-medium"
                    />
                  </Autocomplete>
                </div>

                <div className="relative group">
                  <label className="block text-white/90 font-bold mb-2 flex items-center gap-2">
                    🎯 Destination
                  </label>
                  <Autocomplete
                    onLoad={(autocomplete) => (arriveeAutocompleteRef.current = autocomplete)}
                    onPlaceChanged={() => {
                      const place = arriveeAutocompleteRef.current?.getPlace();
                      if (place && place.formatted_address) {
                        setFormTrajet((prev) => ({ ...prev, arrivee: place.formatted_address }));
                      }
                    }}
                  >
                    <input 
                      type="text" 
                      placeholder="Sélectionnez votre destination..." 
                      value={formTrajet.arrivee}
                      onChange={(e) => setFormTrajet({ ...formTrajet, arrivee: e.target.value })}
                      className="w-full bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:border-teal-400/50 focus:bg-white/20 transition-all duration-300 font-medium"
                    />
                  </Autocomplete>
                </div>
              </div>

              <div className="relative">
                <label className="block text-white/90 font-bold mb-4 flex items-center gap-2">
                  🗺️ Aperçu de l'itinéraire
                </label>
                <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 z-10 pointer-events-none"></div>
                  <GoogleMap
                    mapContainerStyle={{ height: "400px", width: "100%" }}
                    center={{ lat: 45.5017, lng: -73.5673 }}
                    zoom={10}
                    options={{
                      styles: [
                        {
                          featureType: "all",
                          elementType: "geometry",
                          stylers: [{ color: "#1a1a2e" }]
                        },
                        {
                          featureType: "water",
                          elementType: "geometry",
                          stylers: [{ color: "#16213e" }]
                        }
                      ]
                    }}
                  >
                    {directions && <DirectionsRenderer directions={directions} />}
                  </GoogleMap>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="relative group">
              <label className="block text-white/90 font-bold mb-2 flex items-center gap-2">
                📅 Date du trajet
              </label>
              <input
                type="date"
                value={formTrajet.date}
                onChange={(e) => setFormTrajet({ ...formTrajet, date: e.target.value })}
                className="w-full bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300 font-medium"
              />
            </div>

            <div className="relative group">
              <label className="block text-white/90 font-bold mb-2 flex items-center gap-2">
                ⏰ Heure de départ
              </label>
              <input
                type="time"
                value={formTrajet.heure}
                onChange={(e) => setFormTrajet({ ...formTrajet, heure: e.target.value })}
                className="w-full bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-400/50 focus:bg-white/20 transition-all duration-300 font-medium"
              />
            </div>

            <div className="relative group">
              <label className="block text-white/90 font-bold mb-2 flex items-center gap-2">
                👥 Places disponibles
              </label>
              <input
                type="number"
                placeholder="Ex: 3"
                value={formTrajet.places}
                onChange={(e) => setFormTrajet({ ...formTrajet, places: e.target.value })}
                className="w-full bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:border-orange-400/50 focus:bg-white/20 transition-all duration-300 font-medium"
                min={1}
                max={8}
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (
                  !departAutocompleteRef.current?.getPlace() ||
                  !arriveeAutocompleteRef.current?.getPlace()
                ) {
                  alert("Veuillez sélectionner le départ et l'arrivée via la suggestion Google Maps.");
                  return;
                }
                calculateRoute((polyline) => {
                  if (!polyline) {
                    alert("Impossible d'ajouter le trajet : l'itinéraire n'a pas été généré.");
                    return;
                  }
                  handleAjouterTrajet(polyline);
                });
              }}
              className="group relative px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span className="text-2xl">{editTrajet ? "✏️" : "🚀"}</span>
                <span>{editTrajet ? "Modifier le trajet" : "Publier le trajet"}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
