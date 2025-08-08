import React from "react";

const EmailVerification = ({
  userEmail,
  verificationCode,
  setVerificationCode,
  verifyEmailCode,
  sendVerificationCode,
  error,
  loading,
  onBack
}) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Vérification Email
        </h2>
        <p className="text-gray-600 mb-2">
          Un code de vérification a été envoyé à :
        </p>
        <p className="text-blue-600 font-semibold break-all">{userEmail}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code de vérification
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
            placeholder="Entrez le code à 6 chiffres"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
            maxLength="6"
            disabled={loading}
            autoComplete="one-time-code"
          />
        </div>

        <button
          onClick={verifyEmailCode}
          disabled={loading || verificationCode.length !== 6}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Vérification..." : "Vérifier le code"}
        </button>

        <div className="flex justify-between items-center">
          <button
            onClick={sendVerificationCode}
            disabled={loading}
            className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50 transition-colors"
          >
            {loading ? "Envoi..." : "Renvoyer le code"}
          </button>

          <button
            onClick={onBack}
            disabled={loading}
            className="text-gray-600 hover:text-gray-800 text-sm disabled:opacity-50 transition-colors"
          >
            ← Retour
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <p className="font-medium">💡 Conseil :</p>
          <p>Vérifiez vos spams si vous ne recevez pas le code dans les 2 minutes.</p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
