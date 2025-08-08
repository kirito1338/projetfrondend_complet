import { useState, useEffect } from "react";
import Login from "./auth/Login";
import AdminInterface from "./admin/AdminInterface";
import Conducteur from "./conducteur/Conducteur";
import CarteTrajets from "./CarteTrajets";
import api from "./api";
import { useNavigate } from "react-router-dom";
import Navbar from "../src/componants/navbar";
import { ToastContainer, toast } from "react-toastify";
import CustomToastContainer from "./componants/CustomToastContainer";
import Chatbot from "./componants/chatbot";
import { MessageCircle } from "lucide-react";
import Footer from "./componants/Footer";
import APropos from "./componants/APropos";
import ContactAdmin from "./componants/ContactAdmin";
import Carriere from "./componants/Carriere";
import MentionsLegalesModal from "./componants/MentionsLegalesModal";
import { useLang } from "./LangContext"; 

export default function Accueil() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [mode, setMode] = useState("login");
  const [title, setTitle] = useState("");
  const [showApropos, setShowApropos] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showConducteur, setShowConducteur] = useState(false);
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showCarriere, setShowCarriere] = useState(false);
  const [mentionType, setMentionType] = useState(null);
  const { t } = useLang(); 
  const handleHomeClick = () => {
    setShowApropos(false);
    setShowContact(false);
    setShowAdmin(false);
    setShowConducteur(false);
    setShowLogin(false);
    setShowCarriere(false);
    setMentionType(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setShowLogin(false);
    setShowApropos(false);
    setShowContact(false);
    setShowAdmin(false);
    setShowConducteur(false);
    setShowCarriere(false);
    setMentionType(null);

    let index = 0;
    const fullTitle = "Plateforme de Covoiturage Étudiant";
    const interval = setInterval(() => {
      setTitle(fullTitle.slice(0, index + 1));
      index++;
      if (index === fullTitle.length) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = async (userData) => {
    setUser(userData);
    setShowLogin(false);

    if (userData.role === "admin") setShowAdmin(true);
    else if (userData.role === "driver") setShowConducteur(true);

    try {
      let userId = userData.id_user || userData.user?.id_user;
      if (!userId) {
        const userRes = await api.get('/api/users/me');
        userId = userRes.data.id_user;
        setUser({ ...userData, ...userRes.data });
      }

      if (!userId) {
        console.warn("Impossible de récupérer l'ID utilisateur");
        return;
      }

      const [notifRes, progRes, msgRes] = await Promise.all([
        api.get(`/api/notifications/user/${userId}`),
        api.get(`/api/messages_programmes/user/${userId}`),
        api.get(`/api/messages/received/${userId}`),
      ]);

      const allItems = [
        ...notifRes.data.map((n) => ({
          titre: n.titre,
          contenu: n.message,
        })),
        ...progRes.data.map((m) => ({
          titre: "Message programmé",
          contenu: m.contenu,
        })),
        ...msgRes.data.map((m) => ({
          titre: `Message de l'utilisateur ${m.id_expediteur}`,
          contenu: m.contenu,
        })),
      ];

      allItems.forEach((item) => {
        toast.info(
          <div>
            <strong>{item.titre}</strong>
            <p>{item.contenu}</p>
          </div>,
          {
            position: "bottom-right",
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      });
    } catch (err) {
      console.error("Erreur lors du chargement des notifications/messages", err);
    }
  };

  const handleSecretButtonClick = (role) => {
    if (user && user.role === role) {
      if (role === "admin") setShowAdmin(true);
      if (role === "driver") setShowConducteur(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowAdmin(false);
    setShowConducteur(false);
  };

  if (showAdmin) return <AdminInterface user={user} onLogout={handleLogout} />;
  if (showConducteur) return <Conducteur user={user} onLogout={handleLogout} />;

  return (
    <section className="relative min-h-screen overflow-hidden">
      {user?.role === "admin" && (
        <button
          className="absolute top-0 left-0 w-4 h-4 opacity-0 hover:opacity-30 z-50 bg-green-600"
          onClick={() => handleSecretButtonClick("admin")}
          title="Zone admin"
        ></button>
      )}

      {user?.role === "driver" && (
        <button
          className="absolute top-0 left-4 w-4 h-4 opacity-0 hover:opacity-30 z-50 bg-blue-600"
          onClick={() => handleSecretButtonClick("driver")}
          title="Zone conducteur"
        ></button>
      )}

      <Navbar
        user={user}
        handleLogout={handleLogout}
        setShowLogin={setShowLogin}
        setShowApropos={setShowApropos}
        setShowContact={setShowContact}
        showApropos={showApropos}
        showContact={showContact}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        onHomeClick={handleHomeClick}
      />

      <div className="absolute inset-x-0 top-[64px] bottom-0 z-0">
        <img
          src="/femme.jpg"
          alt="school background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
      </div>

      <div className="relative z-20 flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-32">
        <div className="max-w-xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight animate-fade-in">
            {title && (
              <>
                {title}
                <span className="animate-pulse">|</span>
              </>
            )}
          </h1>
          <p className="mb-8 text-lg text-gray-200 animate-pulse">
            {t("trouveOuPropose") ||
              "Trouve ou propose un trajet rapidement dans ton école ou université. Confort, économie et ponctualité réunis !"}
          </p>
          <div className="flex gap-4">
            {user ? (
              <button
                onClick={() => navigate("/trajets")}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-semibold"
              >
                {t("rechercherTrajet")}
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowLogin(true);
                  setMode("login");
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-semibold"
              >
                {t("rechercherTrajet")}
              </button>
            )}
            {(!user || user.role === "driver") && (
              <button
                onClick={() => {
                  setShowLogin(user ? false : true);
                  setMode(user ? "login" : "register");
                  if (user) setShowConducteur(true);
                }}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-md font-semibold border border-white"
              >
                {user ? t("proposerTrajet") : t("devenirConducteur")}
              </button>
            )}
          </div>
        </div>

        <div className="mt-12 md:mt-0 bg-black bg-opacity-50 backdrop-blur-md p-6 rounded-xl shadow-lg text-white w-full max-w-sm space-y-4">
          <h2 className="text-xl font-semibold border-b border-gray-500 pb-2 mb-2">
            {t("pourquoiChoisir")}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-green-400">+95%</span>
              <span>{t("fiabilite") || "Fiabilité"}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-green-400">10k+</span>
              <span>{t("trajets") || "Trajets"}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-green-400">
                {t("etudiants") || "Étudiants"}
              </span>
              <span>{t("inscrits") || "inscrits"}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-green-400">24/7</span>
              <span>{t("support") || "Support"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 md:px-16 py-10">
        <CarteTrajets />
      </div>

      {showApropos && <APropos onClose={() => setShowApropos(false)} />}
      {showContact && <ContactAdmin onClose={() => setShowContact(false)} />}
      {showCarriere && <Carriere onClose={() => setShowCarriere(false)} />}
      {mentionType && (
        <MentionsLegalesModal
          type={mentionType}
          onClose={() => setMentionType(null)}
        />
      )}

      {showLogin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-30">
          <Login
            mode={mode}
            onClose={() => setShowLogin(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      )}
      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-50 hover:bg-blue-600 transition"
        onClick={() => setShowChatbot(true)}
        title={t("ouvrirChatbot")}
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      <ToastContainer />
      <Footer
        onApropos={() => setShowApropos(true)}
        onContact={() => setShowContact(true)}
        onCarriere={() => setShowCarriere(true)}
        setMentionType={setMentionType}
      />
    </section>
  );
}
