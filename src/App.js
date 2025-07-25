import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Accueil from './Accueil';
import Login from './Login';
import CarteTrajets from './CarteTrajets';
import ChercherTrajet from './ChercherTrajet';
import ConsulterTrajet from './ConsulterTrajet';
import ConducteurPage from './Conducteur'; // ✅ à créer
import AdminPage from './AdminInterface'; // ✅ à créer
import Conducteur from './Conducteur';
import AdminInterface from './AdminInterface';
import { Toaster } from 'react-hot-toast';
import MesReservations from './componants/MesReservations';



export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loginMode, setLoginMode] = useState('login');
  const [showNotifications, setShowNotifications] = useState(false);


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData.user);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />

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
                  showNotifications={showNotifications}
                  setShowNotifications={setShowNotifications}
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
          <Route path="/conducteur" element={<Conducteur />} /> {/* ✅ */}
          <Route
            path="/admin"
            element={
              user ? (
                <AdminInterface onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />     
          <Route
            path="/mes-reservations"
            element={
              user && user.role === 'passager' || "student" ? (
                <MesReservations user={user} />
              ) : (
                <Navigate to="/" />
              )
            }
          />


     <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
