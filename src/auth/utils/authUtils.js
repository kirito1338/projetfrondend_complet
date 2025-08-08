// Utilitaires pour la gestion de l'authentification Google

export const isValidGoogleToken = (token) => {
  try {
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  } catch {
    return false;
  }
};

export const isTemporaryGoogleToken = (token) => {
  return token && token.startsWith('google_temp_');
};

export const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const getTokenFromStorage = () => {
  return localStorage.getItem('token');
};

export const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isUserGoogleConnected = (user) => {
  return user && user.provider === 'google';
};

export const shouldShowEmailVerification = (user) => {
  return user && user.provider === 'google' && user.verified === false;
};
