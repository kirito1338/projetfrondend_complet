import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Accueil from './Accueil';
import Login from './Login';
import CarteTrajets from './CarteTrajets';
import ChercherTrajet from './ChercherTrajet';
import ConsulterTrajet from './ConsulterTrajet'; // <-- Import de la page ConsulterTrajet

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loginMode, setLoginMode] = useState('login'); // 'login' or 'register'

  // Charger l'utilisateur depuis localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Accueil
                  user={user}
                  onLogout={handleLogout}
                  onLoginClick={() => setShowLogin(true)}
                />
                {showLogin && (
                  <Login
                    mode={loginMode}
                    onClose={() => setShowLogin(false)}
                    onLoginSuccess={handleLoginSuccess}
                    onSwitchMode={() =>
                      setLoginMode((prev) =>
                        prev === 'login' ? 'register' : 'login'
                      )
                    }
                  />
                )}
              </>
            }
          />
          <Route path="/trajets" element={<ConsulterTrajet />} />
          {/* Rediriger vers l’accueil si l’URL ne correspond à rien */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
