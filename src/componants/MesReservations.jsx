import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../LangContext";
import api from "../api";
import MessageBox from "../componants/MessageBox";
import { Send, Trash2, Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { GoogleMap, DirectionsService, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";
import Navbar from "./navbar"; 
import Footer from "./Footer"; 

const containerStyle = {
  width: "100%",
  height: "250px",
};

const MesReservations = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [reservations, setReservations] = useState([]);
  const [messageBoxData, setMessageBoxData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [directions, setDirections] = useState({}); 
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showApropos, setShowApropos] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Chargement de l'API Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBo_o1KoYrdYgDbPkR2e0uwj5qrXUSeOwE",
  });

 const noterTrajet = async (trajetId, note) => {
  try {
    await api.post(`/api/passager/noter-trajet/${trajetId}`, { note });
    alert("Note envoyée avec succès !");
    setReservations((prev) =>
      prev.map((t) =>
        t.idTrajet === trajetId ? { ...t, note } : t
      )
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi de la note :", error);
    alert("Erreur lors de la notation.");
  }
};
useEffect(() => {
  const userData = localStorage.getItem("user");
  if (userData) setUser(JSON.parse(userData));
}, []);

const handleLogout = () => {
  setUser(null);
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  navigate("/"); 
};

const supprimerHistorique = async (idTrajet) => {
  if (!window.confirm("Supprimer ce trajet de l'historique ?")) return;
  try {
    await api.delete(`/api/passager/supprimer-historique/${idTrajet}`);
    setReservations((prev) => prev.filter((t) => t.idTrajet !== idTrajet));
    alert("Trajet supprimé de l'historique");
  } catch (err) {
    console.error("Erreur suppression historique:", err);
    alert("Erreur lors de la suppression");
  }
};

const confirmerUtilisation = async (trajetId) => {
  try {
    await api.post(`/api/passager/confirmer-utilisation/${trajetId}`);
    setReservations((prev) =>
      prev.map((t) =>
        t.idTrajet === trajetId ? { ...t, utilise: true } : t
      )
    );
    alert("Trajet confirmé comme utilisé !");
  } catch (error) {
    console.error("Erreur lors de la confirmation :", error);
    alert("Erreur lors de la confirmation.");
  }
};

  const fetchReservations = async () => {
    try {
      const res = await api.get("/api/passager/mes-reservations");
      setReservations(res.data);
    } catch (err) {
      console.error("Erreur chargement réservations:", err);
    } finally {
      setLoading(false);
    }
  };

  const annulerReservation = async (idTrajet) => {
    if (!window.confirm("Confirmer l'annulation de ce trajet ?")) return;
    try {
      await api.delete(`/api/passager/annuler-reservation/${idTrajet}`);
      setReservations((prev) => prev.filter((t) => t.idTrajet !== idTrajet));
      alert("Réservation annulée");
    } catch (err) {
      console.error("Erreur annulation:", err);
      alert("Erreur lors de l'annulation");
    }
  };

  const handleDirectionsCallback = (trajetId, result, status) => {
    if (status === "OK") {
      setDirections((prev) => ({ ...prev, [trajetId]: result }));
    } else {
      console.warn("Erreur directions:", status);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
<>
      <Navbar
        user={user}
        handleLogout={handleLogout}
        setShowLogin={setShowLogin}
        setShowApropos={setShowApropos}
        setShowContact={setShowContact}
        showApropos={showApropos}
        showContact={showContact}
      />

    <div className="relative min-h-screen">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <Spline scene="https://prod.spline.design/Ct-JIbUDzlqrrtKO/scene.splinecode" />
      </div>

      <div className="max-w-5xl mx-auto p-6 relative z-10">
        <motion.h2
          className="text-4xl font-bold mb-6 text-green-700 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          🌟 {t("mesReservations")} 🔥
        </motion.h2>

        {loading ? (
          <div className="text-gray-500">{t("chargement")}</div>
        ) : reservations.length === 0 ? (
          <div className="text-gray-500 text-center">{t("aucuneReservation")}</div>
        ) : (
          <div className="space-y-8">
            {reservations.map((trajet, index) => (
              <motion.div
                key={trajet.idTrajet}
                className="bg-gradient-to-br from-green-100 via-white to-blue-100 border shadow-xl rounded-2xl p-6 relative hover:scale-[1.01] transition-transform duration-300"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/150?img=${index + 1}`} />
                      <AvatarFallback>CD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-green-900">
                        {trajet.pointDepart} → {trajet.pointArrivee}
                      </h3>
                      <div className="text-sm text-gray-700">
                        📅 {trajet.date} · ⏰ {trajet.heureDepart} ·
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-white text-xs ${
                            trajet.etat === "confirmé"
                              ? "bg-green-500"
                              : trajet.etat === "en attente"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        >
                          {trajet.etat}
                        </span>
                      </div>
                   <div className="mt-2">
                    {!trajet.utilise ? (
                      <button
                        onClick={() => confirmerUtilisation(trajet.idTrajet)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        J'ai utilisé ce trajet
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-sm">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => noterTrajet(trajet.idTrajet, star)}
                            className="hover:scale-110 transition"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                trajet.note && star <= trajet.note ? "text-yellow-400" : "text-gray-300"
                              }`}
                              fill={trajet.note && star <= trajet.note ? "yellow" : "none"}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-xs text-gray-500">
                          {trajet.note ? `${trajet.note.toFixed(1)}/5` : "Pas encore noté"}
                        </span>
                      </div>
                    )}
                  </div>
                  </div>

                  </div>

                  <div className="flex gap-2 mt-2">
                    {!trajet.utilise ? (
                      <button
                        onClick={() => annulerReservation(trajet.idTrajet)}
                        className="flex items-center bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm shadow"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Annuler
                      </button>
                    ) : (
                      <button
                        onClick={() => supprimerHistorique(trajet.idTrajet)}
                        className="flex items-center bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-900 text-sm shadow"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                      </button>
                    )}
                    <button
                      onClick={() => setMessageBoxData({ idExpediteur: trajet.idConducteur })}
                      className="flex items-center bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm shadow"
                    >
                      <Send className="w-4 h-4 mr-1" /> Contacter
                    </button>
                  </div>
                  </div>

                {isLoaded && (
  <div className="mt-4 rounded overflow-hidden border">
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: 45.5017, lng: -73.5673 }} 
      zoom={10}
    >
      {!directions[trajet.idTrajet] && (
        <DirectionsService
          options={{
            origin: trajet.pointDepart,
            destination: trajet.pointArrivee,
            travelMode: "DRIVING",
          }}
          callback={(result, status) =>
            handleDirectionsCallback(trajet.idTrajet, result, status)
          }
        />
      )}
      {directions[trajet.idTrajet] && (
        <DirectionsRenderer
          options={{
            directions: directions[trajet.idTrajet],
          }}
        />
      )}
    </GoogleMap>
  </div>
)}
              </motion.div>
            ))}
          </div>
        )}

        {messageBoxData && (
          <MessageBox message={messageBoxData} onClose={() => setMessageBoxData(null)} />
        )}
      </div>
    </div>
    <Footer />

  </>
  );
};

export default MesReservations;
