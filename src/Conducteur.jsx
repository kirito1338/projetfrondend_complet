import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { GoogleMap, LoadScript, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";
import { useRef } from "react";

const GOOGLE_MAPS_API_KEY = "AIzaSyBo_o1KoYrdYgDbPkR2e0uwj5qrXUSeOwE";

// Fix icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// URL de base de l'API FastAPI
const API_URL = "http://localhost:8000";

const Conducteur = () => {
  
  const [section, setSection] = useState("accueil");
  const [trajets, setTrajets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [formTrajet, setFormTrajet] = useState({ depart: "", arrivee: "", date: "", heure: "", places: "" });
  const [editTrajet, setEditTrajet] = useState(null);
  const [messageForm, setMessageForm] = useState({
    contenu: "",
    destinataireUserId: "", // utilisateur spécifique (ex: pour répondre à un message)
    trajetId: ""            // pour tous les passagers d’un trajet
  });
  const [loading, setLoading] = useState(false);
  const [conversationOpen, setConversationOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // utilisateur cible
  const [conversation, setConversation] = useState([]);   // messages échangés
  const [newMessage, setNewMessage] = useState("");    
  

   const departAutocompleteRef = useRef(null);
  const arriveeAutocompleteRef = useRef(null);
  const [directions, setDirections] = useState(null);
  const [userNames, setUserNames] = useState({});


  // Le token JWT stocké dans localStorage (à gérer selon ton système d'authentification)
  const token = localStorage.getItem("token");

  // Config axios avec le token Bearer
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
  const fetchNames = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/all_names`, axiosConfig);
      const mapping = {};
      res.data.forEach(u => {
        mapping[u.id] = u.nom;
      });
      setUserNames(mapping);
    } catch (err) {
      console.error("Erreur récupération noms utilisateurs", err);
    }
  };

  fetchNames();
}, []);

  // Charger trajets depuis API au montage
  useEffect(() => {
    if (!token) return;
    fetchTrajets();
    fetchMessages();
  }, [token]);

  // Fetch trajets du conducteur
  const fetchTrajets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/driver/rides`, axiosConfig);
      setTrajets(res.data);
    } catch (error) {
      console.error("Erreur chargement trajets", error);
      alert("Erreur chargement trajets. Veuillez vérifier votre connexion ou authentification.");
    }
    setLoading(false);
  };

  // Fetch messages support
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/support`, axiosConfig);
      setMessages(res.data);
    } catch (error) {
      console.error("Erreur chargement messages", error);
      alert("Erreur chargement messages.");
    }
    setLoading(false);
  };
  const fetchConversation = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/messages/with/${userId}`, axiosConfig);
      setConversation(res.data); // assume { from_me: bool, message: str, date: str }
      setConversationOpen(true);
      setSelectedUser(userId);
    } catch (err) {
      console.error("Erreur chargement conversation", err);
    }
  };


  // Ajouter ou modifier trajet
  const handleAjouterTrajet = async () => {
    try {
      if (editTrajet) {
        // Pas d'endpoint PUT dans ton API, donc suppression + ajout (pas idéal, à améliorer côté backend)
        await axios.delete(`${API_URL}/rides/${editTrajet}`, axiosConfig);
        const newRide = {
          depart: formTrajet.depart,
          arrivee: formTrajet.arrivee,
          date: formTrajet.date,
          heure: formTrajet.heure,
          places: parseInt(formTrajet.places, 10),
        };
        await axios.post(`${API_URL}/rides`, newRide, axiosConfig);
      } else {
        const newRide = {
          depart: formTrajet.depart,
          arrivee: formTrajet.arrivee,
          date: formTrajet.date,
          heure: formTrajet.heure,
          places: parseInt(formTrajet.places, 10),
        };
        await axios.post(`${API_URL}/rides`, newRide, axiosConfig);
      }
      setFormTrajet({ depart: "", arrivee: "", date: "", heure: "", places: "" });
      setEditTrajet(null);
      await fetchTrajets();
      setSection("trajets");
    } catch (error) {
      console.error("Erreur ajout/modification trajet", error);
      alert("Erreur lors de la sauvegarde du trajet.");
    }
  };

  // Modifier un trajet : remplir le formulaire
  const handleModifier = (t) => {
    setFormTrajet({
      depart: t.depart,
      arrivee: t.arrivee,
      date: t.date,
      heure: t.heure,
      places: t.places,
    });
    setEditTrajet(t.id);
    setSection("proposer");
  };

  // Supprimer trajet
  const handleSupprimer = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce trajet ?")) return;
    try {
      await axios.delete(`${API_URL}/rides/${id}`, axiosConfig);
      await fetchTrajets();
    } catch (error) {
      console.error("Erreur suppression trajet", error);
      alert("Erreur lors de la suppression.");
    }
  };

  // Envoyer un message de support
  const handleEnvoyerMessage = async () => {
    if (!messageForm.contenu.trim()) {
      alert("Le message ne peut pas être vide");
      return;
    }
    try {
      await axios.post(`${API_URL}/support`, { message: messageForm.contenu }, axiosConfig);
      setMessageForm({ contenu: "" });
      await fetchMessages();
    } catch (error) {
      console.error("Erreur envoi message", error);
      alert("Erreur lors de l'envoi du message.");
    }
  };
  

  // Déconnexion simple
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  const calculateRoute = async () => {
    if (!departAutocompleteRef.current || !arriveeAutocompleteRef.current) return;

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
          setDirections(result);  // <-- stocke dans l'état
        } else {
          console.error("Erreur itinéraire:", status);
        }
      }
    );
  };

  // Rendu du composant
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
        return (
          <>
            <h2 className="text-3xl font-extrabold text-blue-800 drop-shadow-sm">Bienvenue Conducteur 👋</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Trajets", value: trajets.length },
                { label: "Messages Reçus", value: messages.length },
                { label: "Prochains Trajets", value: trajets.filter(t => new Date(t.date) >= new Date()).length },
              ].map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-white via-gray-50 to-blue-100 p-6 rounded-xl shadow-xl text-center border border-blue-200">
                  <h3 className="text-lg text-blue-600 font-semibold uppercase tracking-wide">{item.label}</h3>
                  <p className="text-4xl font-bold text-blue-900 mt-2">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="w-full h-72 rounded-xl overflow-hidden shadow-xl mt-6 border-2 border-blue-100">
              <MapContainer center={[45.5017, -73.5673]} zoom={12} style={{ height: "100%", width: "100%" }}>
                <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[45.5017, -73.5673]}>
                  <Popup>Départ depuis Montréal</Popup>
                </Marker>
              </MapContainer>
            </div>
          </>
        );

   case "proposer":
        return (
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-blue-700">
              {editTrajet ? "Modifier un trajet" : "Proposer un trajet"}
            </h2>

            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
              <Autocomplete
                onLoad={(autocomplete) => (departAutocompleteRef.current = autocomplete)}
                onPlaceChanged={() => {
                  const place = departAutocompleteRef.current?.getPlace();
                  if (place && place.formatted_address) {
                    setFormTrajet((prev) => ({ ...prev, depart: place.formatted_address }));
                  }
                }}
              >
                <input type="text" placeholder="Départ" className="border p-3 rounded w-full" />
              </Autocomplete>

              <Autocomplete
                onLoad={(autocomplete) => (arriveeAutocompleteRef.current = autocomplete)}
                onPlaceChanged={() => {
                  const place = arriveeAutocompleteRef.current?.getPlace();
                  if (place && place.formatted_address) {
                    setFormTrajet((prev) => ({ ...prev, arrivee: place.formatted_address }));
                  }
                }}

              >
                <input type="text" placeholder="Arrivée" className="border p-3 rounded w-full" />
              </Autocomplete>

              <GoogleMap
                mapContainerStyle={{ height: "400px", width: "100%" }}
                center={{ lat: 45.5017, lng: -73.5673 }}
                zoom={10}
              >
                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            </LoadScript>

            <input
              type="date"
              value={formTrajet.date}
              onChange={(e) => setFormTrajet({ ...formTrajet, date: e.target.value })}
              className="border p-3 rounded w-full"
            />
            <input
              type="time"
              value={formTrajet.heure}
              onChange={(e) => setFormTrajet({ ...formTrajet, heure: e.target.value })}
              className="border p-3 rounded w-full"
            />
            <input
              type="number"
              placeholder="Places disponibles"
              value={formTrajet.places}
              onChange={(e) => setFormTrajet({ ...formTrajet, places: e.target.value })}
              className="border p-3 rounded w-full"
              min={1}
            />
            <button
              onClick={async () => {
                await calculateRoute();
                handleAjouterTrajet();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editTrajet ? "Modifier" : "Ajouter"}
            </button>
          </div>
        );

      case "trajets":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-700">Mes trajets</h2>
            {trajets.length === 0 && <p>Aucun trajet pour le moment.</p>}
            {trajets.map(t => (
              <div key={t.id} className="bg-white p-4 shadow-md rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-blue-800">{t.depart} → {t.arrivee}</h3>
                  <p>{t.date} à {t.heure}</p>
                  <p>Places : {t.places}</p>
                  <p>Approuvé : {t.approved ? "Oui" : "Non"}</p>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleModifier(t)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                    Modifier
                  </button>
                  <button onClick={() => handleSupprimer(t.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

        case "messages":
          return (
            <div className="space-y-4 max-w-md">
              <h2 className="text-2xl font-bold text-blue-700">Messages</h2>

              {messages.length === 0 && <p>Aucun message reçu.</p>}
              {messages.map(msg => (
                <div key={msg.id} className="bg-white p-4 rounded shadow">
                  <p className="font-bold text-blue-800">
                    {userNames[msg.user_id] ? userNames[msg.user_id] : `Utilisateur #${msg.user_id}`}
                  </p>

                  <p>{msg.message || msg.contenu}</p>
                  <p className="text-sm text-gray-500">{msg.date}</p>
                  {msg.reponse && <p className="text-sm text-green-600">Réponse : {msg.reponse}</p>}
                  {/* bouton pour répondre en privé */}
                  <button
                    onClick={() => fetchConversation(msg.user_id)}
                    className="text-sm text-blue-600 underline mt-1"
                  >
                    Répondre en privé
                  </button>
                </div>
              ))}

              {/* Formulaire d'envoi de message */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Envoyer un message</h3>

                {/* Envoi général à tous les passagers d’un trajet */}
                <select
                  className="border p-2 rounded w-full mb-2"
                  value={messageForm.trajetId}
                  onChange={e =>
                    setMessageForm({
                      ...messageForm,
                      trajetId: e.target.value,
                      destinataireUserId: ""
                    })
                  }
                >
                  <option value="">-- Envoyer à tous les passagers d’un trajet --</option>
                  {trajets.map(t => (
                    <option key={t.id} value={t.id}>
                      Trajet {t.depart} → {t.arrivee}
                    </option>
                  ))}
                </select>

                <textarea
                  className="border p-2 rounded w-full mb-2"
                  rows="3"
                  placeholder={
                    messageForm.destinataireUserId
                      ? `Répondre à l'utilisateur #${messageForm.destinataireUserId}`
                      : "Écrire un message..."
                  }
                  value={messageForm.contenu}
                  onChange={e => setMessageForm({ ...messageForm, contenu: e.target.value })}
                />

                <button
                  onClick={async () => {
                    const { contenu, trajetId, destinataireUserId } = messageForm;
                    if (!contenu.trim()) {
                      alert("Le message ne peut pas être vide.");
                      return;
                    }

                    try {
                      if (destinataireUserId) {
                        // envoi privé
                        await axios.post(
                          `${API_URL}/send_message_to_user/${destinataireUserId}`,
                          { message: contenu },
                          axiosConfig
                        );
                      } else if (trajetId) {
                        // envoi aux passagers
                        await axios.post(
                          `${API_URL}/send_message_to_passengers/${trajetId}`,
                          { message: contenu },
                          axiosConfig
                        );
                      } else {
                        alert("Veuillez choisir un destinataire ou un trajet.");
                        return;
                      }

                      setMessageForm({ contenu: "", destinataireUserId: "", trajetId: "" });
                      await fetchMessages();
                    } catch (error) {
                      console.error("Erreur envoi message", error);
                      alert("Erreur lors de l'envoi.");
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Envoyer
                </button>
              </div>
            </div>
          );



      case "parametres":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-700">Paramètres du compte</h2>
            <p>Fonctionnalité à implémenter</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 text-gray-800">
      <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-3xl font-bold text-blue-800">🚗 Covoiturage</h1>
          <nav className="space-x-4 text-sm">
            {["accueil", "proposer", "trajets", "messages", "parametres"].map((item, i) => (
              <button
                key={i}
                onClick={() => setSection(item)}
                className={`transition font-medium px-3 py-1 rounded hover:bg-blue-100 hover:text-blue-800 ${
                  section === item ? "bg-blue-200 text-blue-900 underline" : "text-gray-700"
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
            {token && (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Déconnexion
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto py-10 px-4">{renderSection()}</main>
      {conversationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-4">
          <h2 className="text-xl font-bold text-blue-700 mb-2">
            Discussion avec {userNames[selectedUser] ? userNames[selectedUser] : `Utilisateur #${selectedUser}`}
          </h2>
            
            <div className="h-64 overflow-y-auto border p-3 mb-3 bg-gray-50 rounded">
              {conversation.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-2 p-2 rounded text-sm max-w-[80%] ${
                    msg.from_me ? "bg-blue-100 ml-auto text-right" : "bg-gray-200"
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className="text-xs text-gray-500">{msg.date}</p>
                </div>
              ))}
            </div>

            <textarea
              rows="2"
              className="w-full border p-2 rounded mb-2"
              placeholder="Écrire une réponse..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />

            <div className="flex justify-between">
              <button
                onClick={() => setConversationOpen(false)}
                className="text-gray-600 hover:underline"
              >
                Fermer
              </button>

              <button
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                onClick={async () => {
                  if (!newMessage.trim()) return;
                  try {
                    await axios.post(`${API_URL}/send_message_to_user/${selectedUser}`, {
                      message: newMessage
                    }, axiosConfig);
                    setNewMessage("");
                    await fetchConversation(selectedUser); // refresh
                  } catch (err) {
                    alert("Erreur lors de l'envoi du message.");
                  }
                }}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    
  );
};

export default Conducteur;
