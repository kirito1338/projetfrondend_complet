import React from "react";
import RegisterForm from "../components/RegisterForm";
import ErrorDisplay from "../components/ErrorDisplay";

const RegisterPage = ({ 
  role, 
  setRole, 
  formData, 
  handleRegisterChange, 
  handleRegisterSubmit, 
  handleGoogleLogin, 
  setCurrentMode, 
  error,
  onClose 
}) => {
  return (
    <>
      <ErrorDisplay error={error} />
      <RegisterForm
        role={role}
        setRole={setRole}
        formData={formData}
        handleRegisterChange={handleRegisterChange}
        handleRegisterSubmit={handleRegisterSubmit}
        handleGoogleLogin={handleGoogleLogin}
        setCurrentMode={setCurrentMode}
      />
      <p className="mt-4 text-center text-sm text-gray-600 cursor-pointer" onClick={onClose}>
        Retour à l'accueil
      </p>
    </>
  );
};

export default RegisterPage;
