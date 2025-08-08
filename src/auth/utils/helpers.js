/**
 * Utility functions for authentication
 */

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  return password.length >= 6;
};

// Format error messages from API responses
export const formatErrorMessage = (error) => {
  let message = "Une erreur s'est produite";
  const detail = error.response?.data?.detail;

  if (Array.isArray(detail)) {
    message = detail.map((e) => e.msg).join(" / ");
  } else if (typeof detail === "string") {
    message = detail;
  }

  return message;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role_user || null;
};

// Check if user has specific role
export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

// Validate form data before submission
export const validateRegisterForm = (formData, role) => {
  const errors = [];

  if (!formData.prenom.trim()) errors.push("Le prénom est requis");
  if (!formData.nom.trim()) errors.push("Le nom est requis");
  if (!validateEmail(formData.email)) errors.push("L'email n'est pas valide");
  if (!validatePassword(formData.mot_de_passe)) errors.push("Le mot de passe doit contenir au moins 6 caractères");
  if (!formData.telephone.trim()) errors.push("Le téléphone est requis");
  
  if (role === "student" && !formData.numero_etudiant.trim()) {
    errors.push("Le numéro étudiant est requis");
  }

  return errors;
};

// Validate login form
export const validateLoginForm = (loginData) => {
  const errors = [];

  if (!validateEmail(loginData.email)) errors.push("L'email n'est pas valide");
  if (!loginData.mot_de_passe.trim()) errors.push("Le mot de passe est requis");

  return errors;
};
