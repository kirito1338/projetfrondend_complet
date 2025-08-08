import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const LoginForm = ({ 
  loginData, 
  handleLoginChange, 
  handleLoginSubmit, 
  handleGoogleLogin, 
  setCurrentMode, 
  error 
}) => {
  return (
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
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Login Google échoué")}
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
  );
};

export default LoginForm;
