import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function Login({ mode, onClose, onLoginSuccess }) {
  const navigate = useNavigate();
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [googleUserId, setGoogleUserId] = useState(null);
  const [code, setCode] = useState("");

  const [role, setRole] = useState("student");
  const [currentMode, setCurrentMode] = useState(mode);
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    mot_de_passe: "",
    numero_etudiant: "",
    role: "student",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    mot_de_passe: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, role }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSuccess = (userData) => {
    const role = userData.user?.role_user;
    console.log("Rôle reçu :", role);
    onLoginSuccess(userData);

    if (role === "admin") navigate("/admin");
    else if (role === "conducteur") navigate("/conducteur");
    else navigate("/");
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      first_name: formData.prenom,
      last_name: formData.nom,
      email: formData.email,
      mot_de_passe: formData.mot_de_passe,
      num_de_tele: formData.telephone,
      role_user: formData.role,
    };
    try {
      const response = await axios.post("http://localhost:8000/api/users/register", payload);
      console.log("Registration successful:", response.data);
      setCurrentMode("login");
      setError("");
    } catch (err) {
  let message = "Erreur lors de l'inscription";
  const detail = err.response?.data?.detail;

  if (Array.isArray(detail)) {
    message = detail.map((e) => e.msg).join(" / ");
  } else if (typeof detail === "string") {
    message = detail;
  }

  setError(message);
  console.error("Registration error:", err);
}

  };

  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:8000/api/users/login", loginData);

    const access_token = response.data?.access_token;
    const user = response.data?.user;

    if (!access_token || !user) {
      throw new Error("Réponse invalide du serveur");
    }

    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(user));

    handleLoginSuccess({ access_token, user });
    onClose();
  } catch (err) {
    let message = "Email ou mot de passe incorrect";
    const detail = err.response?.data?.detail;

    if (Array.isArray(detail)) {
      // Cas d’erreurs FastAPI avec liste d’erreurs Pydantic
      message = detail.map((e) => e.msg).join(" / ");
    } else if (typeof detail === "string") {
      message = detail;
    }

    setError(message);
    console.error("Login error:", err);
  }
};

const handleGoogleLogin = async (credentialResponse) => {
  const token = credentialResponse.credential;
  try {
    const res = await axios.post("http://localhost:8000/api/users/login/google", { token });

    // Si le backend demande une vérification par code
    if (res.data.need_code) {
      setGoogleUserId(res.data.user_id);
      setShowCodeInput(true);
      setError(""); // reset error
      return;
    }

    // Si c'est une inscription, ou si pas besoin de code
    const access_token = res.data.access_token;
    const user = res.data.user;
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(user));
    handleLoginSuccess({ access_token, user });
    onClose();
  } catch (err) {
    setError("Connexion Google échouée");
  }
};


  return (
    <section
      className="relative w-screen h-screen flex items-center justify-center px-4 overflow-hidden"
      style={{ backgroundImage: "url('/femme.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-90 p-6 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        
        {currentMode === "register" ? (
          <form onSubmit={handleRegisterSubmit}>
            <div className="mb-6">
              <p className="font-semibold mb-2">Je suis :</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded ${role === "student" ? "bg-green-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setRole("student")}
                >
                  Étudiant
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded ${role === "driver" ? "bg-green-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setRole("driver")}
                >
                  Conducteur
                </button>
              </div>
            </div>

            {role === "student" && (
              <>
                <input 
                  name="prenom"
                  className="w-full mb-4 p-2 border rounded" 
                  placeholder="Prénom" 
                  value={formData.prenom}
                  onChange={handleRegisterChange}
                  required
                />
                <input 
                  name="nom"
                  className="w-full mb-4 p-2 border rounded" 
                  placeholder="Nom" 
                  value={formData.nom}
                  onChange={handleRegisterChange}
                  required
                />
                <input 
                  name="numero_etudiant"
                  className="w-full mb-4 p-2 border rounded" 
                  placeholder="Numéro étudiant" 
                  value={formData.numero_etudiant}
                  onChange={handleRegisterChange}
                  required={role === "student"}
                />
                <input 
                  name="telephone"
                  className="w-full mb-4 p-2 border rounded" 
                  placeholder="Téléphone" 
                  value={formData.telephone}
                  onChange={handleRegisterChange}
                  required
                />
                <input 
                  name="email"
                  type="email"
                  className="w-full mb-4 p-2 border rounded" 
                  placeholder="Adresse Email" 
                  value={formData.email}
                  onChange={handleRegisterChange}
                  required
                />
                <input 
                  name="mot_de_passe"
                  type="password"
                  className="w-full mb-4 p-2 border rounded" 
                  placeholder="Mot de passe" 
                  value={formData.mot_de_passe}
                  onChange={handleRegisterChange}
                  required
                />
              </>
            )}

            {role === "driver" && (
              <>
                <input 
                  name="prenom"
                  className="w-full mb-4 p-2 border rounded" 
                  placeholder="Prénom" 
                  value={formData.prenom}
                  onChange={handleRegisterChange}
                  required
                />
                <input 
                  name="nom"
                  className="w-full mb-4 p-2 border rounded" 
                  placeholder="Nom" 
                  value={formData.nom}
                  onChange={handleRegisterChange}
                  required
                />
                <input 
                  name="telephone"
                  className="w-full mb-4 p-2 border rounded" 
                  placeholder="Téléphone" 
                  value={formData.telephone}
                  onChange={handleRegisterChange}
                  required
                />
                <input 
                  name="email"
                  type="email"
                  className="w-full mb-4 p-2 border rounded" 
                  placeholder="Adresse Email" 
                  value={formData.email}
                  onChange={handleRegisterChange}
                  required
                />
                <input 
                  name="mot_de_passe"
                  type="password"
                  className="w-full mb-4 p-2 border rounded" 
                  placeholder="Mot de passe" 
                  value={formData.mot_de_passe}
                  onChange={handleRegisterChange}
                  required
                />
              </>
            )}

            <button 
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
            >
              S'inscrire
            </button>
            <div className="text-sm mb-4 text-center">
            <span>Ou s'inscrire avec</span>
        <div className="flex justify-center gap-4 mt-2">
                 <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => setError("Échec de la connexion avec Google")}
                  />
        </div>
      </div>
            <p className="mt-4 text-center">
              Déjà inscrit ? <span className="text-green-600 cursor-pointer" onClick={() => setCurrentMode("login")}>Se connecter</span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit}>
            <h2 className="text-xl font-bold mb-4 text-center">Connexion</h2>
            <input 
              name="email"
              type="email"
              className="w-full mb-4 p-2 border rounded" 
              placeholder="Adresse Email" 
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
            <input 
              name="mot_de_passe"
              type="password"
              className="w-full mb-4 p-2 border rounded" 
              placeholder="Mot de passe" 
              value={loginData.mot_de_passe}
              onChange={handleLoginChange}
              required
            />
            <button 
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded mb-4"
            >
              Se connecter
            </button>

            <div className="text-sm mb-4 text-center">
              <span>Ou se connecter avec</span>
              <div className="flex justify-center gap-4 mt-2">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const token = credentialResponse.credential;
                const decoded = jwtDecode(token);
                console.log("Google user decoded:", decoded);

                axios.post("http://localhost:8000/api/users/login/google", { token })
                  .then((res) => {
                    localStorage.setItem("token", res.data.access_token);
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                    handleLoginSuccess(res.data.user); // redirection selon rôle
                    onClose();
                  })
                  .catch((err) => {
                    console.error("Erreur Google Login :", err);
                    setError("Connexion Google échouée");
                  });
              }}
              onError={() => {
                console.log("Login Google échoué");
                setError("Échec de la connexion avec Google");
              }}
            />
                <button type="button" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <img src="/phone.png" alt="Phone" className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="mt-4 text-center">
              Pas de compte ? <span className="text-green-600 cursor-pointer" onClick={() => setCurrentMode("register")}>S'inscrire</span>
            </p>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-gray-600 cursor-pointer" onClick={onClose}>
          Retour à l'accueil
        </p>
      </div>
      {showCodeInput && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    <div className="bg-white p-6 rounded-xl shadow-xl max-w-xs w-full">
      <h3 className="text-lg font-bold mb-2 text-green-700">Vérification Google</h3>
      <p className="mb-4 text-sm text-gray-600">
        Un code de connexion a été envoyé à votre email.<br />
        Veuillez le saisir ci-dessous.
      </p>
      <input
        type="text"
        className="w-full mb-4 p-2 border rounded text-center"
        placeholder="Code à 6 chiffres"
        value={code}
        onChange={e => setCode(e.target.value)}
        maxLength={6}
      />
      <button
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
        onClick={async () => {
          try {
            const res = await axios.post("http://localhost:8000/api/users/login/google/verify-code", {
              user_id: googleUserId,
              code,
            });
            const access_token = res.data.access_token;
            const user = res.data.user;
            localStorage.setItem("token", access_token);
            localStorage.setItem("user", JSON.stringify(user));
            handleLoginSuccess({ access_token, user });
            setShowCodeInput(false);
            setCode("");
            setGoogleUserId(null);
            onClose();
          } catch (err) {
            setError("Code invalide ou expiré");
          }
        }}
      >
        Valider le code
      </button>
      <button
        className="w-full mt-2 text-sm text-gray-500 hover:text-red-500"
        onClick={() => {
          setShowCodeInput(false);
          setCode("");
          setGoogleUserId(null);
        }}
      >
        Annuler
      </button>
    </div>
  </div>
)}
    </section>
  );
}
