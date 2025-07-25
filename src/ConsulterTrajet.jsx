import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { MapPin, Search, Route, MessageCircle, Clock, Calendar, Navigation, Car, User, Send, X } from "lucide-react";
import toast from 'react-hot-toast';
import Navbar from "../src/componants/navbar";
import { useNavigate } from "react-router-dom"; 
import api from "./api";
import MessageBox from "./componants/MessageBox";



const GOOGLE_MAPS_API_KEY = "AIzaSyBo_o1KoYrdYgDbPkR2e0uwj5qrXUSeOwE";

const ConsulterTrajet = () => {
  const [trajets, setTrajets] = useState([]);
  const [filteredTrajets, setFilteredTrajets] = useState([]);
  const [addressDepart, setAddressDepart] = useState("");
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const [directions, setDirections] = useState(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showChatBox, setShowChatBox] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const autocompleteRef = useRef(null);
  const [showApropos, setShowApropos] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [messageBoxData, setMessageBoxData] = useState(null);


  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchTrajets();
  }
}, []);


 const fetchTrajets = async () => {
  try {
    const res = await api.get("/api/trajet/disponibles");

    // ⚠️ suppose que `user.reservations` contient les idTrajet déjà réservés
    const allTrajets = res.data;
    const filtered = user?.reservations
      ? allTrajets.filter(t => !user.reservations.includes(t.idTrajet))
      : allTrajets;

    setTrajets(filtered);
  } catch (err) {
    console.error("Erreur récupération trajets:", err);
  }
};



  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // retourne à l’accueil
  };

const handleReservation = async (trajetId) => {
  try {
    const res = await api.post(`/api/passager/reserver?trajetId=${trajetId}`);
    alert("Réservation effectuée avec succès !");

    // ⚠️ Supprimer le trajet réservé s'il n’a plus de place
    const updated = trajets.filter((t) => t.idTrajet !== trajetId);
    setTrajets(updated);
    setFilteredTrajets(updated);
    setSelectedTrajet(null);
  } catch (err) {
    console.error("Erreur de réservation :", err);
    alert("Erreur lors de la réservation.");
  }
};


  // Get coordinates of a given address
  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const location = response.data.results[0]?.geometry.location;
      if (location) return location;
      else throw new Error("Address not found");
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

 const filterTrajetsByDepart = async () => {
  setIsSearching(true);

  const departCoordinates = await getCoordinates(addressDepart);
  if (!departCoordinates) {
    toast.error("Adresse de départ invalide.");
    setIsSearching(false);
    return;
  }

  const filtered = trajets.filter(
    (trajet) =>
      trajet?.etat?.toLowerCase() === "ouvert" &&
      trajet?.pointDepart?.toLowerCase().includes(addressDepart.toLowerCase())
  );

  if (filtered.length === 0) {
    toast("Aucun trajet trouvé pour cette adresse.", {
      icon: "😢",
      style: {
        borderRadius: "8px",
        background: "#1e293b",
        color: "#fff",
        fontWeight: "500",
        padding: "16px",
      },
    });
  }

  setFilteredTrajets(filtered);
  setIsSearching(false);
  setAnimateCards(true);

  setTimeout(() => setAnimateCards(false), 600);
};


  // Calculate the route between two locations
  const calculateRoute = async (trajet) => {
    if (!trajet || !trajet.pointDepart || !trajet.pointArrivee) {
  console.error("Invalid trip");
  return;
}

const depart = trajet.pointDepart;
const arrivee = trajet.pointArrivee;
    const departCoordinates = await getCoordinates(depart);
    const arriveeCoordinates = await getCoordinates(arrivee);

    if (!departCoordinates || !arriveeCoordinates) {
      console.error("Unable to retrieve coordinates for addresses");
      return;
    }

    if (!window.google || !window.google.maps) {
      console.error("Google Maps API is not loaded");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: departCoordinates,
        destination: arriveeCoordinates,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Error calculating route:", status);
        }
      }
    );
  };

  // Handle trip selection
  const handleTrajetSelection = (event) => {
    const selectedIndex = event.target.value;

    if (selectedIndex === "" || !filteredTrajets[selectedIndex]) {
      setSelectedTrajet(null);
      return;
    }

    const trajet = filteredTrajets[selectedIndex];
    setSelectedTrajet(trajet);
    calculateRoute(trajet);
  };

  const onAutocompleteLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onAutocompletePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      setAddressDepart(place.formatted_address);
    }
  };

  const onLoad = () => {
    setGoogleMapsLoaded(true);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!selectedTrajet) {
      alert("Please select a trip first");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté.");
      return;
    }
    console.log("Sending message to driver:", message);

    try {
      await api.post(
        `api/messages/send_message_to_user/${selectedTrajet.idConducteur}`,
        { contenu: message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage("");
      setShowChatBox(false);
      alert(`Message sent to the driver: ${message}`);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const toggleChatBox = () => {
    setShowChatBox(!showChatBox);
  };

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

    <div className="min-h-screen relative overflow-hidden">
      {/* Sophisticated Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
      
      {/* Dynamic Mesh Overlay */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 600px 400px at 50% 0%, rgba(120, 119, 198, 0.3), transparent),
            radial-gradient(ellipse 800px 600px at 100% 100%, rgba(255, 119, 198, 0.2), transparent),
            radial-gradient(ellipse 400px 300px at 0% 50%, rgba(56, 189, 248, 0.3), transparent),
            radial-gradient(ellipse 500px 350px at 80% 20%, rgba(168, 85, 247, 0.25), transparent)
          `
        }}
      ></div>

      {/* Animated Geometric Network */}
      <div className="absolute inset-0">
        {/* Floating Nodes */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-white/20 rounded-full backdrop-blur-sm"
            style={{
              left: `${15 + (i * 7) % 80}%`,
              top: `${20 + (i * 11) % 60}%`,
              animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
        
        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.3)" />
              <stop offset="100%" stopColor="rgba(168, 85, 247, 0.3)" />
            </linearGradient>
          </defs>
          <path
            d="M 100 200 Q 300 100 500 200 T 900 200"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M 150 400 Q 400 300 650 400 T 1000 400"
            stroke="url(#lineGradient)"
            strokeWidth="1.5"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </svg>
      </div>

      {/* Morphing Blob Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -left-40 w-96 h-96 opacity-20"
          style={{
            background: 'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            animation: 'morph 20s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute -bottom-40 -right-40 w-80 h-80 opacity-15"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #ef4444, #ec4899)',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            animation: 'morph 25s ease-in-out infinite reverse'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-10"
          style={{
            background: 'linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6)',
            borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%',
            animation: 'morph 30s ease-in-out infinite'
          }}
        />
      </div>

      {/* Particle System */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `drift ${10 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Glassmorphism Noise Texture */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `
        }}
      ></div>

      {/* Advanced CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes morph {
          0%, 100% { 
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: rotate(0deg) scale(1);
          }
          25% { 
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            transform: rotate(90deg) scale(1.1);
          }
          50% { 
            border-radius: 50% 60% 30% 70% / 60% 40% 60% 40%;
            transform: rotate(180deg) scale(0.9);
          }
          75% { 
            border-radius: 60% 40% 60% 40% / 40% 70% 60% 50%;
            transform: rotate(270deg) scale(1.05);
          }
        }
        
        @keyframes drift {
          0% { 
            transform: translateY(100vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { 
            transform: translateY(-100px) translateX(100px) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% { 
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.5);
          }
        }
      `}</style>

      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 relative z-10">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Trip Management System
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Find and manage your business travel efficiently
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/40 p-8 hover:shadow-2xl hover:bg-white/95 transition-all duration-300">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
                <Search className="w-6 h-6 mr-3 text-blue-600" />
                Search Available Trips
              </h2>
              <p className="text-gray-600">Enter your departure location to find matching trips</p>
            </div>
            
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]} onLoad={onLoad}>
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <Autocomplete
                    onLoad={onAutocompleteLoad}
                    onPlaceChanged={onAutocompletePlaceChanged}
                  >
                    <input
                      type="text"
                      value={addressDepart}
                      onChange={(e) => setAddressDepart(e.target.value)}
                      placeholder="Enter departure address (e.g., Casablanca, Morocco)"
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </Autocomplete>
                </div>
                <button
                  onClick={filterTrajetsByDepart}
                  disabled={isSearching}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Search Trips</span>
                    </>
                  )}
                </button>
              </div>
            </LoadScript>
          </div>
        </div>

        {/* Results Section */}
        {filteredTrajets.length > 0 && (
          <div className="mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/40 p-8 hover:bg-white/95 transition-all duration-300">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Route className="w-6 h-6 mr-3 text-green-600" />
                Available Trips ({filteredTrajets.length})
              </h3>
              
              <div className="space-y-4">
                <select 
                  onChange={handleTrajetSelection}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">Select a trip to view details</option>
                  {filteredTrajets.map((trajet, index) => (
                    <option key={index} value={index}>
                      {trajet.pointDepart} → {trajet.pointArrivee} ({trajet.date} at {trajet.heureDepart})
                    </option>
                  ))}
                </select>
                
                {filteredTrajets.length > 0 && (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
                    {filteredTrajets.map((trajet, index) => (
                      <div
                        key={trajet.idTrajet || index}
                        className={`p-6 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-102 ${
                          selectedTrajet?.id === trajet.idTrajet 
                            ? 'border-blue-500 bg-blue-50/80 backdrop-blur-sm shadow-lg scale-102' 
                            : 'border-gray-200 bg-white/70 backdrop-blur-sm hover:border-gray-300 hover:bg-white/90'
                        }`}
                        onClick={() => {
                          setSelectedTrajet(trajet);
                          calculateRoute(trajet);
                        }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-2">
                            <Car className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-600">Trip #{trajet.idTrajet}</span>
                          </div>
                          {trajet.prix && (
                            <span className="text-lg font-bold text-green-600">{trajet.prix}</span>
                          )}
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-900 font-medium text-sm">{trajet.pointDepart}</span>
                          </div>
                          <div className="ml-1.5 w-0.5 h-6 bg-gray-300"></div>
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-gray-900 font-medium text-sm">{trajet.pointArrivee}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{trajet.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{trajet.heureDepart}</span>
                          </div>
                        </div>
                        
                        {trajet.conducteur && (
                          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-gray-700 text-sm font-medium">{trajet.conducteur}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Selected Trip Details */}
        {selectedTrajet && (
          <div className="mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/40 p-8 hover:bg-white/95 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <Navigation className="w-6 h-6 mr-3 text-blue-600" />
                  Trip Details
                </h4>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium shadow-sm">
                  Selected
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/40">
                    <h5 className="font-semibold text-gray-900 mb-4">Route Information</h5>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <span className="text-sm text-gray-600">From</span>
                          <p className="font-medium text-gray-900">{selectedTrajet.pointDepart}</p>
                        </div>
                      </div>
                      <div className="ml-1.5 w-0.5 h-8 bg-gray-300"></div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div>
                          <span className="text-sm text-gray-600">To</span>
                          <p className="font-medium text-gray-900">{selectedTrajet.pointArrivee}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/40">
                    <h5 className="font-semibold text-gray-900 mb-4">Schedule</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-600">Date</span>
                          <p className="font-medium text-gray-900">{selectedTrajet.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-600">Time</span>
                          <p className="font-medium text-gray-900">{selectedTrajet.heureDepart}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>   
                <div className="space-y-4">
                  <button
                    onClick={handleDialogOpen}
                    className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>View Route on Map</span>
                  </button>

                 <button
                    onClick={() =>
                      setMessageBoxData({
                        idExpediteur: selectedTrajet.idConducteur,
                      })
                    }
                    className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Contact Driver</span>
                  </button>

                  <button
                    onClick={() => handleReservation(selectedTrajet.idTrajet)}
                    className="w-full px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                  >
                    <span className="text-lg">🛎️</span>
                    <span>Réserver ce trajet</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Dialog with map and route */}
        <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="lg">
          <DialogTitle sx={{ 
            background: '#1e40af', 
            color: 'white',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: '1.25rem'
          }}>
            Trip Route Visualization
          </DialogTitle>
          <DialogContent sx={{ padding: 0 }}>
            {googleMapsLoaded && (
              <GoogleMap 
                mapContainerStyle={{ height: "500px", width: "100%" }} 
                zoom={10}
                center={selectedTrajet ? {
                  lat: parseFloat(selectedTrajet.latitude_depart),
                  lng: parseFloat(selectedTrajet.longitude_depart),
                } : { lat: 33.5731, lng: -7.5898 }}
              >
                {selectedTrajet && (
                  <>
                    <Marker
                      position={{
                        lat: parseFloat(selectedTrajet.latitude_depart),
                        lng: parseFloat(selectedTrajet.longitude_depart),
                      }}
                      title={`Departure: ${selectedTrajet.pointDepart}`}
                    />
                    <Marker
                      position={{
                        lat: parseFloat(selectedTrajet.latitude_arrivee),
                        lng: parseFloat(selectedTrajet.longitude_arrivee),
                      }}
                      title={`Arrival: ${selectedTrajet.pointArrivee}`}
                    />
                  </>
                )}
                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            )}
          </DialogContent>
          <DialogActions sx={{ background: '#f8fafc', padding: 3 }}>
            <Button 
              onClick={handleDialogClose} 
              sx={{
                background: '#1e40af',
                color: 'white',
                '&:hover': {
                  background: '#1d4ed8',
                },
                borderRadius: '8px',
                textTransform: 'none',
                paddingX: 3,
                paddingY: 1.5,
                fontWeight: 500,
              }}
            >
              Close Map
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Contact Button */}
        {selectedTrajet && !showChatBox && (
          <div
            className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transform transition-all duration-300 flex items-center justify-center cursor-pointer"
            onClick={toggleChatBox}
          >
            <MessageCircle className="w-6 h-6" />
          </div>
        )}

        {/* Professional Chat Interface */}
          {messageBoxData && (
              <MessageBox
                message={messageBoxData}
                onClose={() => setMessageBoxData(null)}
              />
            )}

      </div>
    </div>
            </>
  );
};

export default ConsulterTrajet;