// Ceci est le fichier Login.jsx
import { useState, useEffect } from "react";

export default function Login({ mode, onClose }) {
  const [role, setRole] = useState("student");
  const [currentMode, setCurrentMode] = useState(mode);

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  return (
    <section
      className="relative w-screen h-screen flex items-center justify-center px-4 overflow-hidden"
      style={{ backgroundImage: "url('/femme.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-90 p-6 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
        {currentMode === "register" ? (
          <>
            <div className="mb-6">
              <p className="font-semibold mb-2">Je suis :</p>
              <div className="flex gap-4">
                <button
                  className={`px-4 py-2 rounded ${role === "student" ? "bg-green-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setRole("student")}
                >
                  Étudiant
                </button>
                <button
                  className={`px-4 py-2 rounded ${role === "driver" ? "bg-green-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setRole("driver")}
                >
                  Conducteur
                </button>
              </div>
            </div>

            {role === "student" && (
              <>
                <input className="w-full mb-4 p-2 border rounded" placeholder="Prénom" />
                <input className="w-full mb-4 p-2 border rounded" placeholder="Nom" />
                <input className="w-full mb-4 p-2 border rounded" placeholder="Numéro étudiant" />
                <input className="w-full mb-4 p-2 border rounded" placeholder="Téléphone" />
                <input className="w-full mb-4 p-2 border rounded" placeholder="Adresse Email" />
                <input className="w-full mb-4 p-2 border rounded" type="password" placeholder="Mot de passe" />
              </>
            )}

            {role === "driver" && (
              <>
                <input className="w-full mb-4 p-2 border rounded" placeholder="Prénom" />
                <input className="w-full mb-4 p-2 border rounded" placeholder="Nom" />
                <input className="w-full mb-4 p-2 border rounded" placeholder="Téléphone" />
                <input className="w-full mb-4 p-2 border rounded" placeholder="Adresse Email" />
              </>
            )}

            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded">
              S'inscrire
            </button>
            <p className="mt-4 text-center">
              Déjà inscrit ? <span className="text-green-600 cursor-pointer" onClick={() => setCurrentMode("login")}>Se connecter</span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">Connexion</h2>
            <input className="w-full mb-4 p-2 border rounded" placeholder="Adresse Email" />
            <input className="w-full mb-4 p-2 border rounded" type="password" placeholder="Mot de passe" />
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded mb-4">
              Se connecter
            </button>

            <div className="text-sm mb-4 text-center">
              <span>Ou se connecter avec</span>
              <div className="flex justify-center gap-4 mt-2">
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <img src="/google.png" alt="Google" className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <img src="/phone.png" alt="Phone" className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="mt-4 text-center">
              Pas de compte ? <span className="text-green-600 cursor-pointer" onClick={() => setCurrentMode("register")}>S'inscrire</span>
            </p>
          </>
        )}

        <p className="mt-4 text-center text-sm text-gray-600 cursor-pointer" onClick={onClose}>
          Retour à l'accueil
        </p>
      </div>
    </section>
  );
}
