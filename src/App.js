import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Accueil from './Accueil';
import Login from './auth/Login';
import CarteTrajets from './CarteTrajets';
import ChercherTrajet from './ChercherTrajet';
import ConsulterTrajet from './consultertrajets/ConsulterTrajet';
import AdminInterface from './admin/AdminInterface';
import Conducteur from './conducteur/Conducteur';
import { Toaster } from 'react-hot-toast';
import MesReservations from './componants/MesReservations';
import Chatbot from './componants/chatbot';
import { MessageCircle } from 'lucide-react';



export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loginMode, setLoginMode] = useState('login');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setShowLogin(false);
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
            path="/admininterface"
            element={
              user ? (
                <AdminInterface user={user} onLogout={handleLogout} />
              ) : (
                <Accueil
                  user={user}
                  onLogout={handleLogout}
                  onLoginClick={() => setShowLogin(true)}
                  showNotifications={showNotifications}
                  setShowNotifications={setShowNotifications}
                />
              )
            }
          />
          <Route
            path="/mes-reservations"
            element={
              user && (
                user.role === 'passager' || 
                user.role === 'student' || 
                user.role_user === 'passager' || 
                user.role_user === 'student'
              ) ? (
                <MesReservations user={user} />
              ) : (
                <Accueil
                  user={user}
                  onLogout={handleLogout}
                  onLoginClick={() => setShowLogin(true)}
                  showNotifications={showNotifications}
                  setShowNotifications={setShowNotifications}
                />
              )
            }
          />


     <Route 
            path="*" 
            element={
              <Accueil
                user={user}
                onLogout={handleLogout}
                onLoginClick={() => setShowLogin(true)}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
              />
            } 
          />
        </Routes>

        {showChatbot && (
          <Chatbot onClose={() => setShowChatbot(false)} />
        )}

        {!showChatbot && (
          <button
            onClick={() => setShowChatbot(true)}
            className="fixed bottom-8 right-8 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
            title="Ouvrir le chatbot"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}
      </div>
    </Router>
  );
}
