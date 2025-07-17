// Accueil.jsx
import { useState, useEffect } from "react";
import Login from "./Login";
import AdminInterface from "./AdminInterface";
import Conducteur from "./Conducteur";
import CarteTrajets from "./CarteTrajets";
import api from "./api"; // Importez votre instance axios configurée
import { useNavigate } from "react-router-dom";  // <-- ici


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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    let index = 0;
    const fullTitle = "Plateforme de Covoiturage Étudiant";
    const interval = setInterval(() => {
      setTitle(fullTitle.slice(0, index + 1));
      index++;
      if (index === fullTitle.length) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
    if (userData.role === "admin") setShowAdmin(true);
    else if (userData.role === "driver") setShowConducteur(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowAdmin(false);
    setShowConducteur(false);
  };

  if (showAdmin) return <AdminInterface user={user} onLogout={handleLogout} />;
  if (showConducteur) return <Conducteur user={user} onLogout={handleLogout} />;

  const handleSecretButtonClick = (role) => {
    if (user && user.role === role) {
      if (role === "admin") setShowAdmin(true);
      if (role === "driver") setShowConducteur(true);
    }
  };

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

      <nav className="relative z-20 w-full flex justify-between items-center px-6 md:px-16 py-4 bg-gradient-to-r from-green-600 via-teal-600 to-green-600 text-white">
        <div className="text-white text-xl font-bold cursor-pointer">Covoiturage+</div>
        <ul className="flex space-x-6 font-medium items-center">
          <li className="hover:text-yellow-300 cursor-pointer" onClick={() => { setShowApropos(false); setShowContact(false); }}>Accueil</li>
          <li className="hover:text-yellow-300 cursor-pointer" onClick={() => { setShowApropos(true); setShowContact(false); }}>À propos</li>
          <li className="hover:text-yellow-300 cursor-pointer" onClick={() => { setShowContact(true); setShowApropos(false); }}>Contact</li>
          {user ? (
            <>
              <li className="ml-4 text-yellow-300">Bonjour, {user.prenom}!</li>
              <li>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">Déconnexion</button>
              </li>
            </>
          ) : (
            <li>
              <button onClick={() => setShowLogin(true)} className="bg-white text-green-600 px-3 py-1 rounded-md text-sm font-semibold">Connexion</button>
            </li>
          )}
        </ul>
      </nav>

      <div className="absolute inset-x-0 top-[64px] bottom-0 z-0">
        <img src="/femme.jpg" alt="school background" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
      </div>

      <div className="relative z-20 flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-32">
        <div className="max-w-xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight animate-fade-in">
            {title && <>{title}<span className="animate-pulse">|</span></>}
          </h1>
          <p className="mb-8 text-lg text-gray-200 animate-pulse">Trouve ou propose un trajet rapidement dans ton école ou université. Confort, économie et ponctualité réunis !</p>
          <div className="flex gap-4">
            {user ? (
              <button
                onClick={() => navigate('/trajets')}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-semibold"
              >
                Voir les trajets
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowLogin(true);
                  setMode("login");
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-semibold"
              >
                Rejoindre un trajet
              </button>
            )}
            {(!user || user.role === "driver") && (
              <button onClick={() => { setShowLogin(user ? false : true); setMode(user ? "login" : "register"); if (user) setShowConducteur(true); }} className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-md font-semibold border border-white">
                {user ? "Proposer un trajet" : "Devenir conducteur"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-12 md:mt-0 bg-black bg-opacity-50 backdrop-blur-md p-6 rounded-xl shadow-lg text-white w-full max-w-sm space-y-4">
          <h2 className="text-xl font-semibold border-b border-gray-500 pb-2 mb-2">Pourquoi nous choisir ?</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col items-center"><span className="text-2xl font-bold text-green-400">+95%</span><span>Fiabilité</span></div>
            <div className="flex flex-col items-center"><span className="text-2xl font-bold text-green-400">10k+</span><span>Trajets</span></div>
            <div className="flex flex-col items-center"><span className="text-2xl font-bold text-green-400">Étudiants</span><span>inscrits</span></div>
            <div className="flex flex-col items-center"><span className="text-2xl font-bold text-green-400">24/7</span><span>Support</span></div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 md:px-16 py-10">
        <CarteTrajets />
      </div>

      {showApropos && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center">
          <div className="bg-white text-black rounded-lg p-8 max-w-md w-full relative shadow-lg">
            <button className="absolute top-2 right-2 text-xl font-bold" onClick={() => setShowApropos(false)}>×</button>
            <h2 className="text-2xl font-bold mb-4">À propos</h2>
            <p>Notre plateforme de covoiturage a été conçue pour rapprocher les étudiants d’une même école ou université. Que vous soyez conducteur ou passager, facilitez vos trajets au quotidien tout en faisant des économies !</p>
          </div>
        </div>
      )}

      {showContact && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center">
          <div className="bg-white text-black rounded-lg p-8 max-w-md w-full relative shadow-lg">
            <button className="absolute top-2 right-2 text-xl font-bold" onClick={() => setShowContact(false)}>×</button>
            <h2 className="text-2xl font-bold mb-4">Contact</h2>
            <p>Vous pouvez nous contacter à : contact@covoiturageplus.com</p>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-30">
          <Login mode={mode} onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />
        </div>
      )}
    </section>
  );
}
