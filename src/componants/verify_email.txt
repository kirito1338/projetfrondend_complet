import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      verifyEmail(token);
    }
  }, [location]);

  const verifyEmail = async (token) => {
    try {
      const res = await axios.post("http://localhost:8000/api/verify-email", { token });
      setIsVerified(true);
    } catch (err) {
      setError("Erreur lors de la vérification de l'e-mail");
    }
  };

  return (
    <div className="verify-email">
      <h2 className="text-2xl font-bold">Vérification de l'E-mail</h2>
      {isVerified ? (
        <p className="text-green-600">Votre adresse e-mail a été vérifiée avec succès !</p>
      ) : (
        <>
          <p>Veuillez vérifier votre adresse e-mail pour continuer.</p>
          {error && <p className="text-red-600">{error}</p>}
        </>
      )}
    </div>
  );
}
    