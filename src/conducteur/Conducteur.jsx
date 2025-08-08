import React, { useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import api from "../api";
import CustomToastContainer from "../componants/CustomToastContainer";

import Header from "./components/Header";
import ConversationModal from "./components/ConversationModal";

import Dashboard from "./pages/Dashboard";
import ProposerTrajet from "./pages/ProposerTrajet";
import MesTrajets from "./pages/MesTrajets";
import Messages from "./pages/Messages";
import Parametres from "./pages/Parametres";

import useConducteurData from "./hooks/useConducteurData";
import { API_URL, convertTo24HourFormat, decodePolyline } from "./utils/helpers";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Conducteur = () => {
  const [section, setSection] = useState("accueil");
  const [formTrajet, setFormTrajet] = useState({ depart: "", arrivee: "", date: "", heure: "", places: "" });
  const [editTrajet, setEditTrajet] = useState(null);
  const [messageForm, setMessageForm] = useState({
    contenu: "",
    destinataireUserId: "",
    trajetId: ""
  });
  const [conversationOpen, setConversationOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [cheminPoints, setCheminPoints] = useState(null);
  const [directions, setDirections] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  const departAutocompleteRef = useRef(null);
  const arriveeAutocompleteRef = useRef(null);

  const {
    trajets,
    setTrajets,
    messages,
    userNames,
    loading,
    fetchTrajets,
    fetchMessages,
    token,
    axiosConfig,
    currentUserId
  } = useConducteurData();

  const fetchConversation = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/api/messages/with/${userId}`, axiosConfig);
      console.log("Conversation récupérée pour userId:", userId, res.data);
      setConversation(res.data);
      setConversationOpen(true);
      setSelectedUser(userId);
    } catch (err) {
      console.error("Erreur chargement conversation pour userId:", userId, err);
    }
  };

  const handleAjouterTrajet = async (polyline) => {
    console.log("Appel handleAjouterTrajet avec polyline =", polyline);

    try {
      const heure24 = convertTo24HourFormat(formTrajet.heure);

      const newRide = {
        pointDepart: formTrajet.depart,
        pointArrivee: formTrajet.arrivee,
        date: formTrajet.date,
        heureDepart: heure24,
        placesDisponibles: parseInt(formTrajet.places, 10),
        etat: "ouvert",
        chemin_points: polyline
      };

      await axios.post(`${API_URL}/api/trajet/addTrajet`, newRide, axiosConfig);

      setFormTrajet({ depart: "", arrivee: "", date: "", heure: "", places: "" });
      setEditTrajet(null);
      await fetchTrajets();
      setSection("trajets");
    } catch (error) {
      console.error(" Erreur ajout/modification trajet", error);
      alert("Erreur lors de l'ajout ou modification du trajet.");
    }
  };

  const handleModifier = (t) => {
    const [dateStr, timeStr] = t.heureDepart.split(" ");
    setFormTrajet({
      depart: t.pointDepart,
      arrivee: t.pointArrivee,
      date: dateStr,
      heure: timeStr,
      places: t.placesDisponibles,
    });
    setEditTrajet(t.idTrajet);
    setSection("proposer");
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce trajet ?")) return;
    try {
      await axios.delete(`${API_URL}/api/Conducteur/trajet/${id}`, axiosConfig);
      await fetchTrajets();
    } catch (error) {
      console.error("Erreur suppression trajet", error);
      alert("Erreur lors de la suppression.");
    }
  };

  const handleEnvoyerMessageForm = async () => {
    const { contenu, trajetId, destinataireUserId } = messageForm;
    console.log("📤 handleEnvoyerMessageForm appelé avec:", { contenu, trajetId, destinataireUserId });

    if (!contenu.trim()) {
      alert("Le message ne peut pas être vide.");
      return;
    }

    try {
      if (destinataireUserId) {
        console.log("📤 Envoi message privé à l'utilisateur:", destinataireUserId);
        await api.post(`/api/messages/send_message_to_user/${destinataireUserId}`, { contenu });
        console.log("✅ Message privé envoyé avec succès via handleEnvoyerMessageForm");
      } else if (trajetId) {
        console.log("📤 Envoi à tous les passagers du trajet:", trajetId, "contenu =", contenu);
        await api.post(`/api/messages/send_message_to_passengers/${trajetId}`, { contenu });
        console.log("✅ Message aux passagers envoyé avec succès");
      } else {
        alert("Veuillez choisir un destinataire ou un trajet.");
        return;
      }

      setMessageForm({ contenu: "", destinataireUserId: "", trajetId: "" });
      await fetchMessages();

      setSuccessToast("Message envoyé avec succès ! 🎉");
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (error) {
      console.error("❌ Erreur envoi message dans handleEnvoyerMessageForm:", error);
      alert("Erreur lors de l'envoi.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const calculateRoute = (callback) => {
    if (!departAutocompleteRef.current || !arriveeAutocompleteRef.current) {
      console.log("Autocomplete refs non définis");
      if (callback) callback(null);
      return;
    }
    const origin = departAutocompleteRef.current.getPlace()?.formatted_address;
    const destination = arriveeAutocompleteRef.current.getPlace()?.formatted_address;

    if (!origin || !destination) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          console.log("result.routes:", result.routes);
          const overview = result.routes[0]?.overview_polyline;
          const encodedPolyline = overview?.points || overview;
          console.log("encodedPolyline:", encodedPolyline);
          if (encodedPolyline) {
            const decoded = decodePolyline(encodedPolyline);
            if (decoded && decoded.length > 0) {
              const decodedStr = JSON.stringify(decoded);
              setCheminPoints(decodedStr);
              if (callback) callback(decodedStr);
            } else {
              if (callback) callback(null);
            }
          } else {
            if (callback) callback(null);
          }
        }
      }
    );
  };

  const renderSection = () => {
    if (!token) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-2xl mb-4">Vous devez être connecté</h2>
          <p>Implémentez un formulaire de login pour obtenir un token JWT et le stocker dans localStorage sous la clé "token".</p>
        </div>
      );
    }

    if (loading) {
      return <p>Chargement...</p>;
    }

    switch (section) {
      case "accueil":
        return <Dashboard trajets={trajets} messages={messages} />;

      case "proposer":
        return (
          <ProposerTrajet
            editTrajet={editTrajet}
            formTrajet={formTrajet}
            setFormTrajet={setFormTrajet}
            departAutocompleteRef={departAutocompleteRef}
            arriveeAutocompleteRef={arriveeAutocompleteRef}
            directions={directions}
            calculateRoute={calculateRoute}
            handleAjouterTrajet={handleAjouterTrajet}
          />
        );

      case "trajets":
        return (
          <MesTrajets
            trajets={trajets}
            handleModifier={handleModifier}
            handleSupprimer={handleSupprimer}
          />
        );

      case "messages":
        return (
          <Messages
            messages={messages}
            userNames={userNames}
            fetchConversation={fetchConversation}
            messageForm={messageForm}
            setMessageForm={setMessageForm}
            trajets={trajets}
            handleEnvoyerMessageForm={handleEnvoyerMessageForm}
            successToast={successToast}
          />
        );

      case "parametres":
        return <Parametres />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 hover:scale-125 hover:rotate-2 cursor-pointer group opacity-10 hover:opacity-30">
          <div className="relative">
            <svg width="400" height="200" viewBox="0 0 400 200" className="drop-shadow-2xl">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <rect x="60" y="100" width="280" height="60" rx="15" fill="url(#carGradient)" filter="url(#glow)" className="group-hover:fill-cyan-400 transition-all duration-500"/>
              <rect x="100" y="70" width="200" height="45" rx="15" fill="url(#carTopGradient)" className="group-hover:fill-blue-400 transition-all duration-500"/>
              
              <defs>
                <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6"/>
                  <stop offset="50%" stopColor="#1E40AF"/>
                  <stop offset="100%" stopColor="#1E3A8A"/>
                </linearGradient>
                <linearGradient id="carTopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA"/>
                  <stop offset="100%" stopColor="#3B82F6"/>
                </linearGradient>
              </defs>
              
              <rect x="120" y="75" width="60" height="30" rx="8" fill="rgba(135, 206, 235, 0.8)" className="group-hover:fill-cyan-200 transition-colors"/>
              <rect x="220" y="75" width="60" height="30" rx="8" fill="rgba(135, 206, 235, 0.8)" className="group-hover:fill-cyan-200 transition-colors"/>
              
              <circle cx="120" cy="145" r="25" fill="#1F2937" className="group-hover:fill-gray-700 transition-colors"/>
              <circle cx="280" cy="145" r="25" fill="#1F2937" className="group-hover:fill-gray-700 transition-colors"/>
              <circle cx="120" cy="145" r="15" fill="#374151" className="group-hover:animate-spin"/>
              <circle cx="280" cy="145" r="15" fill="#374151" className="group-hover:animate-spin"/>
              
              <circle cx="350" cy="115" r="12" fill="#FEF08A" className="animate-pulse group-hover:fill-cyan-300 transition-colors"/>
              <circle cx="350" cy="140" r="12" fill="#FEF08A" className="animate-pulse group-hover:fill-cyan-300 transition-colors"/>
              
              <rect x="80" y="110" width="20" height="12" rx="3" fill="#EF4444" className="group-hover:fill-red-400 transition-colors"/>
              <rect x="300" y="110" width="20" height="12" rx="3" fill="#EF4444" className="group-hover:fill-red-400 transition-colors"/>
            </svg>
            
            <div className="absolute -left-24 top-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-6 h-6 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
              <div className="w-4 h-4 bg-blue-400 rounded-full ml-6 mt-3 animate-ping opacity-60" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full ml-4 mt-2 animate-ping opacity-50" style={{animationDelay: '0.4s'}}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full ml-3 mt-2 animate-ping opacity-40" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 left-20 opacity-10">
          <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse blur-xl"></div>
        </div>
        <div className="absolute top-40 right-32 opacity-10">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse blur-xl" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="absolute bottom-32 left-40 opacity-10">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full animate-pulse blur-xl" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent opacity-40">
          <div className="absolute bottom-12 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-60 animate-pulse">
            <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <Header
          section={section}
          setSection={setSection}
          token={token}
          handleLogout={handleLogout}
        />
        
        <main className="max-w-6xl mx-auto py-10 px-4">{renderSection()}</main>
      </div>
      
      <ConversationModal
        conversationOpen={conversationOpen}
        setConversationOpen={setConversationOpen}
        selectedUser={selectedUser}
        userNames={userNames}
        conversation={conversation}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        fetchConversation={fetchConversation}
        token={token}
        currentUserId={currentUserId}
      />
      
      <CustomToastContainer />
    </div>
  );
};

export default Conducteur;
