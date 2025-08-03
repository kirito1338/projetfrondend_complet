import React, { createContext, useContext, useState, useEffect } from "react";

// Les traductions globales
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
    // Ajoute ici toutes les autres clés utilisées dans le site
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
    // Ajoute ici toutes les autres clés utilisées dans le site
  },
};

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  // Fonction de traduction
  const t = (key) => translations[lang][key] || key;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

// Hook utilitaire pour utiliser la langue partout
export function useLang() {
  return useContext(LangContext);
}