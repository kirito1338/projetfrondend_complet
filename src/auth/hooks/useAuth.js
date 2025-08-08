import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const useAuth = ({ mode, onClose, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [googleUserId, setGoogleUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState("student");
  const [currentMode, setCurrentMode] = useState(mode);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFallbackNotice, setShowFallbackNotice] = useState(false);

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

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, role }));
  }, [role]);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "role") {
      setRole(value);
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSuccess = (userData) => {
    const userRole = userData.user?.role_user;
    console.log("Rôle reçu :", userRole);
    onLoginSuccess(userData);

    if (userRole === "admin") navigate("/admin");
    else if (userRole === "conducteur") navigate("/conducteur");
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
    setLoading(true);
    setError(""); 
    
    try {
      const decoded = jwtDecode(token);
      console.log("Google user decoded:", decoded);

      const googleEmail = decoded.email;
      setUserEmail(googleEmail);

      const res = await axios.post("http://localhost:8000/api/users/login/google", { token });

      if (res.data.need_code || res.data.requires_verification) {
        setGoogleUserId(res.data.user_id);

        //utilise le token temporaire
        if (res.data.temporary_token) {
          localStorage.setItem("token", res.data.temporary_token);
          const tempUser = {
            id_user: res.data.user_id,
            email: res.data.email || googleEmail,
            first_name: decoded.given_name || decoded.name?.split(' ')[0] || "Utilisateur",
            last_name: decoded.family_name || decoded.name?.split(' ').slice(1).join(' ') || "Google",
            role_user: role,
            verified: false
          };
          localStorage.setItem("user", JSON.stringify(tempUser));
        }
        
        setShowEmailVerification(true);
        setError("");
        setLoading(false);
        
        // Envoyer automatiquement le code de vérification avec l'email
        //ca marche pas a cause que j'ai pas un device 
        //qui supporte l'envoi automatique
        setTimeout(() => {
          console.log("Tentative d'envoi automatique du code pour:", googleEmail);
          if (googleEmail) {
            sendVerificationCodeWithEmail(googleEmail, res.data.user_id);
          }
        }, 500);
        return;
      }

      if (res.data.access_token && res.data.user) {
        const access_token = res.data.access_token;
        const user = res.data.user;
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
        handleLoginSuccess({ access_token, user });
        onClose();
        setLoading(false);
        return;
      }

      // Cas dun fallback
      setError("Réponse inattendue du serveur");
      setLoading(false);
      
    } catch (err) {
      setLoading(false);
      
      let message = "Connexion Google échouée";
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === "string") {
          message = detail;
        } else if (Array.isArray(detail)) {
          message = detail.map((e) => e.msg).join(" / ");
        }
      }
      
      setError(message);
      console.error("Erreur Google Login :", err);
    }
  };

  const sendVerificationCode = async () => {
    console.log("sendVerificationCode appelé avec:", { userEmail, googleUserId });
    
    if (!userEmail) {
      setError("Email utilisateur manquant");
      console.error("userEmail est vide:", userEmail);
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("http://localhost:8000/api/users/send-verification-code", { 
        email: userEmail,
        user_id: googleUserId 
      });
      
      setError("");
      
      if (response.data.message) {
        setMessage(response.data.message);
      }
      
    } catch (err) {
      let message = "Erreur lors de l'envoi du code de vérification";
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === "string") {
          message = detail;
        }
      }
      
      setError(message);
      console.error("Erreur envoi code:", err);
    }
    setLoading(false);
  };

  const sendVerificationCodeWithEmail = async (email, userId = null) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("http://localhost:8000/api/users/send-verification-code", { 
        email: email,
        user_id: userId || googleUserId 
      });
      
      setError("");
      
      if (response.data.message) {
        setMessage(response.data.message);
      }
      
    } catch (err) {
      let message = "Erreur lors de l'envoi du code de vérification";
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === "string") {
          message = detail;
        }
      }
      
      setError(message);
      console.error("Erreur envoi code:", err);
    }
    setLoading(false);
  };

  const verifyEmailCode = async () => {
    if (!verificationCode.trim()) {
      setError("Veuillez entrer le code de vérification");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/users/verify-email-code", {
        email: userEmail,
        code: verificationCode,
        user_id: googleUserId
      });

      if (res.data.access_token && res.data.user) {
        const access_token = res.data.access_token;
        const user = res.data.user;
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
        handleLoginSuccess({ access_token, user });
        onClose();
      }
    } catch (err) {
      let message = "Code de vérification invalide";
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === "string") {
          message = detail;
        }
      }
      
      setError(message);
      console.error("Erreur vérification code:", err);
    }
    setLoading(false);
  };

  return {
    // State
    showCodeInput,
    setShowCodeInput,
    showEmailVerification,
    setShowEmailVerification,
    googleUserId,
    setGoogleUserId,
    userEmail,
    setUserEmail,
    verificationCode,
    setVerificationCode,
    code,
    setCode,
    role,
    setRole,
    currentMode,
    setCurrentMode,
    error,
    setError,
    formData,
    loginData,
    loading,
    showFallbackNotice,
    setShowFallbackNotice,
    
    // Handlers
    handleRegisterChange,
    handleLoginChange,
    handleLoginSuccess,
    handleRegisterSubmit,
    handleLoginSubmit,
    handleGoogleLogin,
    sendVerificationCode,
    sendVerificationCodeWithEmail,
    verifyEmailCode,
  };
};

export default useAuth;
