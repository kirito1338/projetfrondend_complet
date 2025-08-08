import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import RoleSelector from "./RoleSelector";
import StudentForm from "./StudentForm";
import DriverForm from "./DriverForm";

const RegisterForm = ({ 
  role, 
  setRole, 
  formData, 
  handleRegisterChange, 
  handleRegisterSubmit, 
  handleGoogleLogin, 
  setCurrentMode 
}) => {
  return (
    <form onSubmit={handleRegisterSubmit}>
      <RoleSelector role={role} setRole={setRole} />

      {role === "student" && (
        <StudentForm 
          formData={formData} 
          handleRegisterChange={handleRegisterChange} 
          role={role} 
        />
      )}

      {role === "conducteur" && (
        <DriverForm 
          formData={formData} 
          handleRegisterChange={handleRegisterChange} 
        />
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
            onError={() => console.log("Échec de la connexion avec Google")}
          />
        </div>
      </div>
      
      <p className="mt-4 text-center">
        Déjà inscrit ? <span className="text-green-600 cursor-pointer" onClick={() => setCurrentMode("login")}>Se connecter</span>
      </p>
    </form>
  );
};

export default RegisterForm;
