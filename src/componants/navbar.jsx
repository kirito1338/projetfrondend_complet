import { useState, useEffect } from "react";
import {
  LogOut,
  LogIn,
  UserCircle2,
  Info,
  Mail,
  Home,
  Bell,
  X,
  Globe,
} from "lucide-react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import ContactAdmin from "./ContactAdmin";
import APropos from "./APropos";
import SimpleTranslate from "../SimpleTranslate";
import CentreMessage from "./centremessage";
import { useLang } from "../LangContext";

const translations = {
  fr: {
    accueil: "Accueil",
    apropos: "À propos",
    contact: "Contact",
    mesReservations: "Mes Réservations",
    monInterface: "Mon Interface",
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
  },
  en: {
    accueil: "Home",
    apropos: "About",
    contact: "Contact",
    mesReservations: "My Bookings",
    monInterface: "My Interface",
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
  },
};

const Navbar = ({
  user,
  handleLogout,
  setShowLogin,
  setShowApropos,
  setShowContact,
  showApropos,
  showContact,
  onHomeClick, 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAProposModal, setShowAProposModal] = useState(false);
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();

  const isPassager =
    user &&
    (user.role === "passager" ||
      user.role === "student" ||
      user.role_user === "passager" ||
      user.role_user === "student");

  const isConducteur =
    user &&
    (user.role === "conducteur" ||
      user.role_user === "conducteur");

  const isAdmin =
    user &&
    (user.role === "admin" ||
      user.role_user === "admin" ||
      user.is_admin === 1 ||
      user.is_admin === true);

  return (
    <>
      <nav className="relative z-50 w-full bg-gradient-to-r from-[#0f2027] via-[#2c5364] to-[#00c6ff] shadow-2xl border-b border-white/10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-3 flex justify-between items-center">
          <div 
            className="flex items-center space-x-3 cursor-pointer group mr-auto"
            onClick={() => {
              if (onHomeClick) {
                onHomeClick();
              } else {
                navigate("/");
              }
            }}
          >
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white animate-bounce" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-3xl font-extrabold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent tracking-widest drop-shadow-lg group-hover:tracking-[.2em] transition-all duration-300">
              VroomVroom
            </span>
          </div>

          <ul className="flex items-center space-x-2 md:space-x-6 font-semibold text-white text-base">
            <li
              className="relative group flex items-center cursor-pointer px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-400/20 hover:to-blue-400/20 transition"
              onClick={() => { 
                setShowApropos(false); 
                setShowContact(false); 
                if (onHomeClick) {
                  onHomeClick();
                } else {
                  navigate("/");
                }
              }}
            >
              <Home size={20} className="mr-1 group-hover:text-green-400 transition" />
              <span>{t("accueil")}</span>
              <span className="absolute left-0 bottom-0 w-0 h-1 bg-green-400 rounded-full group-hover:w-full transition-all duration-300"></span>
            </li>
            <li
              className="relative group flex items-center cursor-pointer px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-400/20 hover:to-purple-400/20 transition"
              onClick={() => { setShowAProposModal(true); }}
            >
              <Info size={20} className="mr-1 group-hover:text-blue-400 transition" />
              <span>{t("apropos")}</span>
              <span className="absolute left-0 bottom-0 w-0 h-1 bg-blue-400 rounded-full group-hover:w-full transition-all duration-300"></span>
            </li>
            <li
              className="relative group flex items-center cursor-pointer px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-400/20 hover:to-green-400/20 transition"
              onClick={() => { setShowContactModal(true); }}
            >
              <Mail size={20} className="mr-1 group-hover:text-purple-400 transition" />
              <span>{t("contact")}</span>
              <span className="absolute left-0 bottom-0 w-0 h-1 bg-purple-400 rounded-full group-hover:w-full transition-all duration-300"></span>
            </li>
            {(isPassager || isConducteur) && (
              <li
                className="relative group flex items-center cursor-pointer px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-400/20 hover:to-blue-400/20 transition"
                onClick={() => {
                  if (isPassager) {
                    navigate("/mes-reservations");
                  } else if (isConducteur) {
                    navigate("/conducteur");
                  }
                }}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M3 10h11M9 21V3m4 18l6-6-6-6" />
                </svg>
                <span>{isConducteur ? t("monInterface") : t("mesReservations")}</span>
                <span className="absolute left-0 bottom-0 w-0 h-1 bg-green-400 rounded-full group-hover:w-full transition-all duration-300"></span>
              </li>
            )}
            {isAdmin && (
              <li>
                <button
                  onClick={() => navigate("/admininterface")}
                  className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 text-white shadow-lg font-bold transition-all duration-300 hover:scale-105"
                >
                  <span className="mr-2">⚡</span>
                  {t("interfaceAdmin")}
                </button>
              </li>
            )}
            {user ? (
              <>
                <li className="flex items-center px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 text-yellow-300 font-bold shadow group">
                  <UserCircle2 size={22} className="mr-1" />
                  <span>
                    {t("bonjour")},{" "}
                    {user.prenom || user.first_name || user.nom || user.last_name || user.email || t("utilisateur")} !
                  </span>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white font-bold shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <LogOut size={18} className="mr-1" />
                    {t("deconnexion")}
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center px-4 py-2 rounded-lg bg-white text-green-700 font-bold shadow hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  <LogIn size={18} className="mr-1" />
                  {t("connexion")}
                </button>
              </li>
            )}
            {user && (
              <li>
                <button
                  onClick={() => setShowNotifications(true)}
                  className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-600 hover:to-yellow-400 text-white font-bold shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Bell className="mr-2" />
                  {t("notification")}
                </button>
              </li>
            )}
            <li>
              <SimpleTranslate />
            </li>
          </ul>
        </div>
      </nav>
      
      <CentreMessage 
        user={user}
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      
      {showContactModal && (
        <ContactAdmin onClose={() => setShowContactModal(false)} />
      )}
      {showAProposModal && (
        <APropos onClose={() => setShowAProposModal(false)} />
      )}
      
      <style>{`
        nav {
          font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
        }
        /* Affiche le menu langue au hover */
        .group:hover .group-hover\\:block {
          display: block;
        }
      `}</style>
    </>
  );
};

export default Navbar;