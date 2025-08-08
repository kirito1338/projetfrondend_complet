import React from "react";
import LoginForm from "../components/LoginForm";
import ErrorDisplay from "../components/ErrorDisplay";

const LoginPage = ({ 
  loginData, 
  handleLoginChange, 
  handleLoginSubmit, 
  handleGoogleLogin, 
  setCurrentMode, 
  error,
  onClose 
}) => {
  return (
    <>
      <ErrorDisplay error={error} />
      <LoginForm
        loginData={loginData}
        handleLoginChange={handleLoginChange}
        handleLoginSubmit={handleLoginSubmit}
        handleGoogleLogin={handleGoogleLogin}
        setCurrentMode={setCurrentMode}
        error={error}
      />
      <p className="mt-4 text-center text-sm text-gray-600 cursor-pointer" onClick={onClose}>
        Retour à l'accueil
      </p>
    </>
  );
};

export default LoginPage;
