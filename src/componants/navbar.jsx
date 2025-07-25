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
} from "lucide-react";
import api from "../api";
import MessageBox from "../componants/MessageBox";
import { useNavigate } from "react-router-dom";




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
  const navigate = useNavigate();


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

  return (
    <>
      <nav className="relative z-50 w-full bg-gradient-to-r from-green-700 via-teal-600 to-green-700 shadow-md border-b border-white/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white tracking-wide flex items-center space-x-2 cursor-pointer">
            <svg className="w-6 h-6 text-yellow-300 animate-pulse" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
            <span>Covoiturage+</span>
          </div>

          <ul className="flex items-center space-x-6 text-white font-medium text-sm md:text-base">
            <li className="hover:text-yellow-300 flex items-center cursor-pointer" onClick={() => { setShowApropos(false); setShowContact(false); }}>
              <Home size={18} />
              <span>Accueil</span>
            </li>
            <li className="hover:text-yellow-300 flex items-center cursor-pointer" onClick={() => { setShowApropos(true); setShowContact(false); }}>
              <Info size={18} />
              <span>À propos</span>
            </li>
            <li className="hover:text-yellow-300 flex items-center cursor-pointer" onClick={() => { setShowContact(true); setShowApropos(false); }}>
              <Mail size={18} />
              <span>Contact</span>
            </li>
           {user && user.role === "passager" || "student" && (
            <li>
              <button
                onClick={() => navigate("/mes-reservations")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm shadow-md flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M3 10h11M9 21V3m4 18l6-6-6-6" />
                </svg>
                <span>Mes Réservations</span>
              </button>
            </li>
          )}



            {user ? (
              <>
                <li className="text-yellow-300 font-semibold flex items-center">
                  <UserCircle2 size={20} />
                  <span>Bonjour, {user.prenom} !</span>
                </li>
                <li>
                  <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm shadow-md flex items-center">
                    <LogOut size={16} />
                    <span>Déconnexion</span>
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button onClick={() => setShowLogin(true)} className="bg-white text-green-700 font-semibold px-4 py-1.5 rounded-md text-sm shadow hover:bg-gray-100 flex items-center">
                  <LogIn size={16} />
                  <span>Connexion</span>
                </button>
              </li>
            )}

            {user && (
              <li>
                <button onClick={() => setShowNotifications(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-md text-sm shadow-md flex items-center">
                  <Bell className="mr-1" />
                  <span>Centre</span>
                </button>
              </li>
            )}
          </ul>
          

        </div>
      </nav>
          {selectedMessage && (
            <MessageBox
              message={selectedMessage}
              onClose={() => setSelectedMessage(null)}
            />
          )}
      {/* ✅ Panneau latéral stylé */}
      <div className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-xl border-l transition-transform duration-300 z-50 ${showNotifications ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-green-700 flex items-center gap-2">
            <Bell /> Centre de messages
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

          className="cursor-pointer p-3 bg-gray-100 rounded-lg shadow border-l-4 border-green-600 space-y-1 hover:bg-gray-200 transition"
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
    </>
  );
};

export default Navbar;
