import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function MontrealMapCard() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBo_o1KoYrdYgDbPkR2e0uwj5qrXUSeOwE", // <-- Remplace par ta clé API
  });
  const center = { lat: 45.5017, lng: -73.5673 }; // Montréal

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center w-full max-w-5xl mx-auto">
      <h3 className="text-lg font-semibold mb-2">Localisation : Montréal</h3>
      <div className="w-full h-[500px] rounded-lg overflow-hidden">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={12}
          >
            <Marker position={center} />
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">Chargement de la carte...</div>
        )}
      </div>
    </div>
  );
}
