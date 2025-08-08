import React from "react";

import AuthBackground from "./components/AuthBackground";
import GoogleCodeVerification from "./components/GoogleCodeVerification";
import EmailVerification from "./components/EmailVerification";
import FallbackNotice from "./components/FallbackNotice";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import useAuth from "./hooks/useAuth";

const Login = ({ mode, onClose, onLoginSuccess }) => {
  const {
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
    verifyEmailCode,
  } = useAuth({ mode, onClose, onLoginSuccess });

  return (
    <>
      <AuthBackground>
        {showEmailVerification ? (
          <EmailVerification
            userEmail={userEmail}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            verifyEmailCode={verifyEmailCode}
            sendVerificationCode={sendVerificationCode}
            error={error}
            loading={loading}
            onBack={() => {
              setShowEmailVerification(false);
              setError("");
              setVerificationCode("");
            }}
          />
        ) : currentMode === "register" ? (
          <RegisterPage
            role={role}
            setRole={setRole}
            formData={formData}
            handleRegisterChange={handleRegisterChange}
            handleRegisterSubmit={handleRegisterSubmit}
            handleGoogleLogin={handleGoogleLogin}
            setCurrentMode={setCurrentMode}
            error={error}
            onClose={onClose}
          />
        ) : (
          <LoginPage
            loginData={loginData}
            handleLoginChange={handleLoginChange}
            handleLoginSubmit={handleLoginSubmit}
            handleGoogleLogin={handleGoogleLogin}
            setCurrentMode={setCurrentMode}
            error={error}
            onClose={onClose}
          />
        )}
      </AuthBackground>

      <GoogleCodeVerification
        showCodeInput={showCodeInput}
        code={code}
        setCode={setCode}
        googleUserId={googleUserId}
        setShowCodeInput={setShowCodeInput}
        setGoogleUserId={setGoogleUserId}
        handleLoginSuccess={handleLoginSuccess}
        onClose={onClose}
        setError={setError}
      />

      <FallbackNotice
        show={showFallbackNotice}
        onClose={() => setShowFallbackNotice(false)}
      />
    </>
  );
};

export default Login;
