import { useState, useEffect } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import { getCoordinates } from '../utils/mapUtils';

export default function useTripData() {
  const [trajets, setTrajets] = useState([]);
  const [filteredTrajets, setFilteredTrajets] = useState([]);
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const [directions, setDirections] = useState(null);
  const [addressDepart, setAddressDepart] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchTrajets(parsedUser);
    }
  }, []);

  const fetchTrajets = async (currentUser = user) => {
    try {
      const res = await api.get("/api/trajet/disponibles");
      const allTrajets = res.data;
      const filtered = currentUser?.reservations
        ? allTrajets.filter(t => !currentUser.reservations.includes(t.idTrajet))
        : allTrajets;

      setTrajets(filtered);
    } catch (err) {
      console.error("Erreur récupération trajets:", err);
    }
  };

  const filterTrajetsByDepart = async () => {
    setIsSearching(true);
    setHasSearched(true);

    try {
      const res = await api.post("/api/trajet/proches", { address: addressDepart });
      setFilteredTrajets(res.data);
      setIsSearching(false);
      
      if (res.data.length === 0) {
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
    } catch (err) {
      setIsSearching(false);
      toast.error("Erreur lors de la recherche de trajets proches.");
    }
  };

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

  const handleReservation = async (trajetId) => {
    try {
      const res = await api.post(`/api/passager/reserver?trajetId=${trajetId}`);
      alert("Réservation effectuée avec succès !");

      const updated = trajets.filter((t) => t.idTrajet !== trajetId);
      setTrajets(updated);
      setFilteredTrajets(updated);
      setSelectedTrajet(null);
    } catch (err) {
      console.error("Erreur de réservation :", err);
      alert("Erreur lors de la réservation.");
    }
  };

  return {
    trajets,
    filteredTrajets,
    selectedTrajet,
    setSelectedTrajet,
    directions,
    addressDepart,
    setAddressDepart,
    isSearching,
    hasSearched,
    user,
    fetchTrajets,
    filterTrajetsByDepart,
    calculateRoute,
    handleReservation
  };
}
