import { useState, useEffect } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const useEtudiantData = (userProp) => {
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
    let filtered = trajets;
    if (searchParams.depart) {
      filtered = filtered.filter(t => 
        t.pointDepart?.toLowerCase().includes(searchParams.depart.toLowerCase())
      );
    }
    if (searchParams.arrivee) {
      filtered = filtered.filter(t => 
        t.pointArrivee?.toLowerCase().includes(searchParams.arrivee.toLowerCase())
      );
    }
    if (searchParams.date) {
      filtered = filtered.filter(t => t.date === searchParams.date);
    }
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

  const handleFavoris = (trajet) => {
    const isAlreadyFavorite = favoris.find(f => f.idTrajet === trajet.idTrajet);
    if (isAlreadyFavorite) {
      setFavoris(prev => prev.filter(f => f.idTrajet !== trajet.idTrajet));
      alert("Retiré des favoris !");
    } else {
      setFavoris(prev => [...prev, trajet]);
      alert("Ajouté aux favoris !");
    }
  };

  const handleUpdateProfil = async (formData) => {
    try {
      await API.put("/passager/profile", formData);
      setProfil(prev => ({ ...prev, ...formData }));
      setEditProfil(false);
      alert("Profil mis à jour avec succès !");
    } catch (e) {
      alert("Erreur lors de la mise à jour du profil.");
    }
  };

  return {
    // State
    selectedSection,
    setSelectedSection,
    trajets,
    setTrajets,
    reservations,
    favoris,
    profil,
    editProfil,
    setEditProfil,
    searchParams,
    setSearchParams,
    
    // Actions
    handleSearch,
    handleReserver,
    handleFavoris,
    handleUpdateProfil,
    fetchTrajets,
    fetchReservations,
    fetchProfile,
  };
};

export default useEtudiantData;
