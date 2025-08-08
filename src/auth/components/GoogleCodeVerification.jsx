import React from "react";
import axios from "axios";

const GoogleCodeVerification = ({ 
  showCodeInput, 
  code, 
  setCode, 
  googleUserId, 
  setShowCodeInput, 
  setGoogleUserId, 
  handleLoginSuccess, 
  onClose, 
  setError 
}) => {
  const handleCodeVerification = async () => {
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
  };

  const handleCancel = () => {
    setShowCodeInput(false);
    setCode("");
    setGoogleUserId(null);
  };

  if (!showCodeInput) return null;

  return (
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
          onClick={handleCodeVerification}
        >
          Valider le code
        </button>
        <button
          className="w-full mt-2 text-sm text-gray-500 hover:text-red-500"
          onClick={handleCancel}
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default GoogleCodeVerification;
