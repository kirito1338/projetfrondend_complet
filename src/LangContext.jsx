import React, { createContext, useContext, useState, useEffect } from "react";

const translations = {
  fr: {
    accueil: "Accueil",
    apropos: "À propos",
    contact: "Contact",
    mesReservations: "Mes Réservations",
    interfaceAdmin: "Interface Admin",
    bonjour: "Bonjour",
    deconnexion: "Déconnexion",
    connexion: "Connexion",
    notification: "Notification",
    centreMessages: "Centre de messages",
    utilisateur: "Utilisateur",
    langue: "Langue",
    francais: "Français",
    anglais: "Anglais",
    
    bienvenue: "Bienvenue sur notre plateforme de covoiturage",
    sousTitle: "Partagez vos trajets, économisez et rencontrez de nouvelles personnes",
    decouvrir: "Découvrir",
    rechercherTrajet: "Rechercher un trajet",
    proposerTrajet: "Proposer un trajet",
    gererReservations: "Gérer mes réservations",
    
    chercher: "Chercher",
    depart: "Départ",
    arrivee: "Arrivée",
    date: "Date",
    heure: "Heure",
    places: "Places",
    prix: "Prix",
    conducteur: "Conducteur",
    passager: "Passager",
    reserver: "Réserver",
    annuler: "Annuler",
    modifier: "Modifier",
    supprimer: "Supprimer",
    
    nom: "Nom",
    prenom: "Prénom", 
    email: "Email",
    motDePasse: "Mot de passe",
    confirmerMotDePasse: "Confirmer le mot de passe",
    telephone: "Téléphone",
    adresse: "Adresse",
    sauvegarder: "Sauvegarder",
    
    chargement: "Chargement...",
    aucunTrajet: "Aucun trajet trouvé",
    aucuneReservation: "Aucune réservation trouvée",
    success: "Succès",
    erreur: "Erreur",
    confirmation: "Confirmation",
    
    dashboard: "Tableau de bord",
    profil: "Profil",
    parametres: "Paramètres",
    aide: "Aide",
    mentions: "Mentions légales",
    
    ajouter: "Ajouter",
    rechercher: "Rechercher",
    voir: "Voir",
    fermer: "Fermer",
    ouvrir: "Ouvrir",
    suivant: "Suivant",
    precedent: "Précédent",
    retour: "Retour",
    
    devenirConducteur: "Devenir conducteur",
    pourquoiChoisir: "Pourquoi nous choisir ?",
    fiabilite: "Fiabilité",
    trajets: "Trajets", 
    etudiants: "Étudiants",
    inscrits: "inscrits",
    support: "Support",
    ouvrirChatbot: "Ouvrir le chatbot",
    
    rechercherTrajetsDisponibles: "Rechercher des trajets disponibles",
    entrerLieuDepart: "Entrez votre lieu de départ pour trouver des trajets correspondants",
    entrerAdresseDepart: "Entrez l'adresse de départ (ex: Casablanca, Maroc)",
    recherche: "Recherche",
    
    trajetsProposed: "Trajets proposés",
    utilisateursInscrits: "Utilisateurs inscrits", 
    trajetsAValider: "Trajets à valider",
    demandesSupport: "Demandes de support",
    
    trouverTrajetIdeal: "Trouvez votre trajet idéal",
    voyagerSecurite: "Voyagez en toute sécurité avec d'autres étudiants. Économique, écologique et convivial."
  },
  en: {
    accueil: "Home",
    apropos: "About",
    contact: "Contact",
    mesReservations: "My Bookings",
    interfaceAdmin: "Admin Panel",
    bonjour: "Hello",
    deconnexion: "Logout",
    connexion: "Login",
    notification: "Notification",
    centreMessages: "Message Center",
    utilisateur: "User",
    langue: "Language",
    francais: "French",
    anglais: "English",
    
    bienvenue: "Welcome to our rideshare platform",
    sousTitle: "Share your rides, save money and meet new people",
    decouvrir: "Discover",
    rechercherTrajet: "Search for a ride",
    proposerTrajet: "Offer a ride",
    gererReservations: "Manage my bookings",
    
    chercher: "Search",
    depart: "Departure",
    arrivee: "Arrival",
    date: "Date",
    heure: "Time",
    places: "Seats",
    prix: "Price",
    conducteur: "Driver",
    passager: "Passenger",
    reserver: "Book",
    annuler: "Cancel",
    modifier: "Edit",
    supprimer: "Delete",
    
    nom: "Last Name",
    prenom: "First Name",
    email: "Email",
    motDePasse: "Password",
    confirmerMotDePasse: "Confirm Password",
    telephone: "Phone",
    adresse: "Address",
    sauvegarder: "Save",
    
    chargement: "Loading...",
    aucunTrajet: "No trips found",
    aucuneReservation: "No bookings found",
    success: "Success",
    erreur: "Error",
    confirmation: "Confirmation",
    
    dashboard: "Dashboard",
    profil: "Profile",
    parametres: "Settings",
    aide: "Help",
    mentions: "Legal Notice",
    
    ajouter: "Add",
    rechercher: "Search",
    voir: "View",
    fermer: "Close",
    ouvrir: "Open",
    suivant: "Next",
    precedent: "Previous",
    retour: "Back",
    
    devenirConducteur: "Become a driver",
    pourquoiChoisir: "Why choose us?",
    fiabilite: "Reliability",
    trajets: "Trips",
    etudiants: "Students", 
    inscrits: "registered",
    support: "Support",
    ouvrirChatbot: "Open chatbot",
    
    rechercherTrajetsDisponibles: "Search Available Trips",
    entrerLieuDepart: "Enter your departure location to find matching trips",
    entrerAdresseDepart: "Enter departure address (e.g., Casablanca, Morocco)",
    recherche: "Searching",
    
    trajetsProposed: "Proposed trips",
    utilisateursInscrits: "Registered users",
    trajetsAValider: "Trips to validate", 
    demandesSupport: "Support requests",
    
    trouverTrajetIdeal: "Find your ideal trip",
    voyagerSecurite: "Travel safely with other students. Economical, ecological and friendly."
  },
};

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = (key) => translations[lang][key] || key;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}