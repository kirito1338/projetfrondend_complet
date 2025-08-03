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
} from "lucide-react"; // Ajoute Globe pour l'icône langue
import api from "../api";
import MessageBox from "../componants/MessageBox";
import { useNavigate } from "react-router-dom";
import ContactAdmin from "./ContactAdmin";
import APropos from "./APropos";
import { useLang } from "../LangContext"; // adapte le chemin si besoin

// Ajoute un objet de traduction simple
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
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAProposModal, setShowAProposModal] = useState(false);
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    const fetchAll = async () => {
      if (!user || !user.id_user) return;

      try {
        const [notifRes, progRes, msgRes] = await Promise.all([
          api.get(`/api/notifications/user/${user.id_user}`),
          api.get(`/api/messages/programmes/user/${user.id_user}`),
          api.get(`/api/messages/received/${user.id_user}`),
        ]);

        setAllMessages([
          ...notifRes.data.map((n) => ({ type: "notification", ...n })),
          ...progRes.data.map((p) => ({ type: "programmé", ...p })),
          ...msgRes.data.map((m) => ({ type: "message", ...m })),
        ]);
      } catch (err) {
        console.error("Erreur chargement centre de messages :", err);
      }
    };

    if (showNotifications && user?.id_user) {
      fetchAll();
    }
  }, [showNotifications, user]);

  const isPassager =
    user &&
    (user.role === "passager" ||
      user.role === "student" ||
      user.role_user === "passager" ||
      user.role_user === "student");

  const isAdmin =
    user &&
    (user.role === "admin" ||
      user.role_user === "admin");

  return (
    <>
      <nav className="relative z-50 w-full bg-gradient-to-r from-[#0f2027] via-[#2c5364] to-[#00c6ff] shadow-2xl border-b border-white/10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-3 flex justify-between items-center">
          {/* Logo stylé à gauche */}
          <div className="flex items-center space-x-3 cursor-pointer group mr-auto">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white animate-bounce" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-3xl font-extrabold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent tracking-widest drop-shadow-lg group-hover:tracking-[.2em] transition-all duration-300">
              VroomVroom
            </span>
          </div>

          {/* Menu stylé */}
          <ul className="flex items-center space-x-2 md:space-x-6 font-semibold text-white text-base">
            <li
              className="relative group flex items-center cursor-pointer px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-400/20 hover:to-blue-400/20 transition"
              onClick={() => { setShowApropos(false); setShowContact(false); }}
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
            {isPassager && (
              <li
                className="relative group flex items-center cursor-pointer px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-400/20 hover:to-blue-400/20 transition"
                onClick={() => navigate("/mes-reservations")}
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
                <span>{t("mesReservations")}</span>
                <span className="absolute left-0 bottom-0 w-0 h-1 bg-green-400 rounded-full group-hover:w-full transition-all duration-300"></span>
              </li>
            )}
            {isAdmin && (
              <li>
                <button
                  onClick={() => navigate("/admin")}
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
          </ul>
        </div>
      </nav>
      {/* ...reste du composant inchangé... */}
      {selectedMessage && (
        <MessageBox
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
      <div className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-xl border-l transition-transform duration-300 z-50 ${showNotifications ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-green-700 flex items-center gap-2">
            <Bell /> {t("centreMessages")}
          </h2>
          <button onClick={() => setShowNotifications(false)} className="text-gray-600 hover:text-red-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-full space-y-3">
          {allMessages.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (
                  (item.type === "message" || item.type === "programmé") &&
                  item.idExpediteur
                ) {
                  setSelectedMessage(item);
                }
              }}
              className="cursor-pointer p-3 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 rounded-lg shadow border-l-4 border-green-600 space-y-1 hover:bg-gradient-to-r hover:from-green-200 hover:to-blue-200 transition"
            >
              <div className="text-xs text-gray-500 font-mono">[{item.type}]</div>
              <div className="font-semibold text-sm">{item.titre || item.contenu}</div>
              <div className="text-xs text-gray-600">
                {item.date_notification || item.date_programmation || item.date_envoi}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modales Contact et À propos */}
      {showContactModal && (
        <ContactAdmin onClose={() => setShowContactModal(false)} />
      )}
      {showAProposModal && (
        <APropos onClose={() => setShowAProposModal(false)} />
      )}
      {!showNotifications && (
        <div className="flex-1 flex justify-end">
          <div className="relative flex items-center">
            {/* Bouton glissant custom langue, toujours dans le coin droit */}
            <button
              className={`w-24 h-10 flex items-center rounded-full px-1 transition-colors duration-300 focus:outline-none ${
                lang === "fr"
                  ? "bg-gradient-to-r from-green-400 to-blue-400"
                  : "bg-gradient-to-r from-blue-400 to-green-400"
              } shadow group`}
              aria-label={t("langue")}
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              style={{ position: "fixed", top: 24, right: 32, zIndex: 100 }}
            >
              <span
                className={`absolute left-1 top-1 w-8 h-8 rounded-full bg-white shadow transition-transform duration-300 ${
                  lang === "fr" ? "translate-x-0" : "translate-x-14"
                }`}
              />
              <span
                className={`z-10 w-1/2 text-center font-bold text-sm transition-colors duration-300 ${
                  lang === "fr" ? "text-green-700" : "text-gray-500"
                }`}
              >
                FR
              </span>
              <span
                className={`z-10 w-1/2 text-center font-bold text-sm transition-colors duration-300 ${
                  lang === "en" ? "text-blue-700" : "text-gray-500"
                }`}
              >
                EN
              </span>
            </button>
          </div>
        </div>
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