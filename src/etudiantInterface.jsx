import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUserFriends, FaStar, FaHeart, FaFilter,
  FaBell, FaUser, FaHistory, FaSignOutAlt, FaArrowLeft, FaEdit, FaSave, FaTrash
} from "react-icons/fa";

const API = axios.create({
  baseURL: "/api",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default function EtudiantInterface({ user: userProp, onLogout }) {
  const [selectedSection, setSelectedSection] = useState("recherche");
  const [trajets, setTrajets] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [favoris, setFavoris] = useState([]);
  const [profil, setProfil] = useState(null);
  const [editProfil, setEditProfil] = useState(false);
  const [searchParams, setSearchParams] = useState({
    depart: "",
    arrivee: "",
    date: "",
    passagers: 1,
  });

  // Fetch profile, trips, reservations
  useEffect(() => {
    fetchProfile();
    fetchTrajets();
    fetchReservations();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/passager/profile");
      setProfil({
        nom: data.first_name,
        prenom: data.last_name,
        email: data.email,
        telephone: data.telephone || "",
        universite: data.universite || "",
        niveau: data.niveau || "",
        trajetsEffectues: data.trajets_effectues || 0,
        note: data.note || 5,
        preferences: data.preferences || [],
      });
    } catch (e) {
      setProfil({
        nom: userProp?.first_name || "Étudiant",
        prenom: userProp?.last_name || "Test",
        email: userProp?.email || "etudiant@test.com",
        telephone: "",
        universite: "",
        niveau: "",
        trajetsEffectues: 0,
        note: 5,
        preferences: [],
      });
    }
  };

  const fetchTrajets = async () => {
    try {
      const { data } = await API.get("/trajet/disponibles");
      setTrajets(data);
    } catch (e) {
      setTrajets([]);
    }
  };

  const fetchReservations = async () => {
    try {
      const { data } = await API.get("/passager/mes-reservations");
      setReservations(data);
    } catch (e) {
      setReservations([]);
    }
  };

  const handleSearch = async () => {
    // Simple filter on loaded trajets
    let filtered = trajets;
    if (searchParams.depart)
      filtered = filtered.filter(t => t.pointDepart?.toLowerCase().includes(searchParams.depart.toLowerCase()));
    if (searchParams.arrivee)
      filtered = filtered.filter(t => t.pointArrivee?.toLowerCase().includes(searchParams.arrivee.toLowerCase()));
    if (searchParams.date)
      filtered = filtered.filter(t => t.date === searchParams.date);
    setTrajets(filtered);
  };

  const handleReserver = async (trajetId) => {
    try {
      await API.post(`/passager/reserver?trajetId=${trajetId}`);
      alert("Réservation effectuée avec succès !");
      fetchTrajets();
      fetchReservations();
    } catch (e) {
      alert("Erreur lors de la réservation.");
    }
  };

  // Favoris: local only for now
  const handleFavoris = (trajet) => {
    setFavoris((prev) => prev.find(f => f.idTrajet === trajet.idTrajet) ? prev : [...prev, trajet]);
    alert("Ajouté aux favoris !");
  };

  // --- UI rendering below (same as your code, but using real data) ---

  const renderContent = () => {
    switch (selectedSection) {
      case "recherche":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Hero Section */}
            {/* ... (keep your hero section code) ... */}
            {/* Search bar */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative group">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="D'où partez-vous ?"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl"
                    value={searchParams.depart}
                    onChange={e => setSearchParams({ ...searchParams, depart: e.target.value })}
                  />
                </div>
                <div className="relative group">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Où allez-vous ?"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl"
                    value={searchParams.arrivee}
                    onChange={e => setSearchParams({ ...searchParams, arrivee: e.target.value })}
                  />
                </div>
                <div className="relative group">
                  <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl"
                    value={searchParams.date}
                    onChange={e => setSearchParams({ ...searchParams, date: e.target.value })}
                  />
                </div>
                <div className="relative group">
                  <FaUserFriends className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl"
                    value={searchParams.passagers}
                    onChange={e => setSearchParams({ ...searchParams, passagers: e.target.value })}
                  >
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} passager{n > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl"
                >
                  <FaSearch className="text-xl" />
                  <span>Rechercher</span>
                </button>
              </div>
            </div>
            {/* Résultats de recherche */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Trajets disponibles</h2>
                    <p className="text-gray-600">Trouvez le trajet parfait pour votre voyage</p>
                  </div>
                </div>
                <div className="space-y-6">
                  {trajets.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaSearch className="text-4xl text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucun trajet trouvé</h3>
                    </div>
                  ) : (
                    trajets.map((trajet, index) => (
                      <div key={trajet.idTrajet || index}>
                        <TrajetCard
                          trajet={trajet}
                          onReserver={() => handleReserver(trajet.idTrajet)}
                          onFavoris={() => handleFavoris(trajet)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case "reservations":
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
            {/* ... (keep your reservation section code, but use reservations state) ... */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Toutes mes réservations</h2>
                <div className="space-y-6">
                  {reservations.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaHistory className="text-4xl text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucune réservation</h3>
                    </div>
                  ) : (
                    reservations.map((reservation, idx) => (
                      <ReservationCard key={reservation.idTrajet || idx} reservation={reservation} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      // ... Favoris and Profil sections unchanged, but use real data if available ...
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... Header, nav, footer as in your code ... */}
      <main>{renderContent()}</main>
      <button
        onClick={() => window.location.href = '/'}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110"
      >
        <FaArrowLeft />
      </button>
    </div>
  );
}

// --- TrajetCard and ReservationCard: adapt to backend fields ---
function TrajetCard({ trajet, onReserver, onFavoris }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{trajet.pointDepart} → {trajet.pointArrivee}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaUser className="text-blue-400" />
              <span>Conducteur #{trajet.idConducteur}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 mb-1">{trajet.prix || "?"}$</div>
            <div className="text-sm text-gray-500">par personne</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaMapMarkerAlt className="text-blue-500" />
            <div>
              <div className="text-sm text-gray-500">Départ</div>
              <div className="font-semibold text-gray-900">{trajet.pointDepart}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaMapMarkerAlt className="text-green-500" />
            <div>
              <div className="text-sm text-gray-500">Arrivée</div>
              <div className="font-semibold text-gray-900">{trajet.pointArrivee}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaCalendarAlt className="text-purple-500" />
            <div>
              <div className="text-sm text-gray-500">Date</div>
              <div className="font-semibold text-gray-900">{trajet.date}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <FaClock className="text-blue-500" />
              <span>{trajet.heureDepart}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaUserFriends className="text-green-500" />
              <span>{trajet.placesDisponibles} places</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={onFavoris} className="p-2 text-gray-400 hover:text-red-500">
              <FaHeart className="text-xl" />
            </button>
            <button onClick={onReserver} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">
              Réserver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReservationCard({ reservation }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">
            {reservation.pointDepart} → {reservation.pointArrivee}
          </h3>
          <p className="text-sm text-gray-600">Conducteur: #{reservation.idConducteur}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
          Réservé
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Date:</span>
          <span className="ml-2 font-medium">{reservation.date}</span>
        </div>
        <div>
          <span className="text-gray-600">Heure:</span>
          <span className="ml-2 font-medium">{reservation.heureDepart}</span>
        </div>
      </div>
    </div>
  );
}