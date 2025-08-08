import React from "react";
import { FaUsers, FaTrash, FaUser, FaCrown, FaCar, FaGraduationCap } from "react-icons/fa";

export default function UserManagement({ users, userSearch, setUserSearch, handleDeleteUser }) {
  // Filtrage des utilisateurs selon la recherche
  const filteredUsers = users.filter(
    user =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.role_user.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Fonction pour obtenir l'icône selon le rôle
  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return <FaCrown style={{ color: '#ffd700' }} />;
      case 'conducteur': return <FaCar style={{ color: '#48dbfb' }} />;
      case 'student': return <FaGraduationCap style={{ color: '#ff9ff3' }} />;
      case 'passager': return <FaUser style={{ color: '#a8e6cf' }} />;
      default: return <FaUser style={{ color: '#a8e6cf' }} />;
    }
  };

  // Fonction pour obtenir le badge de statut
  const getRoleBadge = (role) => {
    const badgeClass = `admin-status-badge ${
      role?.toLowerCase() === 'admin' ? 'admin-status-active' :
      role?.toLowerCase() === 'conducteur' ? 'admin-status-pending' :
      'admin-status-rejected'
    }`;
    return badgeClass;
  };

  return (
    <div className="admin-fade-in">
      {/* Search Section */}
      <div className="admin-search-container">
        <input
          type="text"
          placeholder="🔍 Rechercher un utilisateur par nom, email ou rôle..."
          className="admin-search-input"
          value={userSearch}
          onChange={e => setUserSearch(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="admin-table-container">
        <h3 style={{ 
          color: 'white', 
          fontSize: '1.3rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <FaUsers style={{ marginRight: '0.5rem', color: '#ffd700' }} />
          Liste des Utilisateurs ({filteredUsers.length})
        </h3>

        {filteredUsers.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: 'rgba(255, 255, 255, 0.7)', 
            padding: '3rem',
            fontSize: '1.1rem'
          }}>
            <FaUsers style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
            <p>Aucun utilisateur trouvé.</p>
            {userSearch && <p style={{ fontSize: '0.9rem' }}>Essayez de modifier votre recherche.</p>}
          </div>
        ) : (
          <div className="admin-table" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#ffd700',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    Utilisateur
                  </th>
                  <th style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#ffd700',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    Email
                  </th>
                  <th style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#ffd700',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    Rôle
                  </th>
                  <th style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    padding: '1rem', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: '#ffd700',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr 
                    key={user.id_user} 
                    style={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <td style={{ padding: '1rem', color: 'white' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #ff6b6b, #feca57)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '1rem',
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600' }}>
                            {user.first_name} {user.last_name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                            ID: {user.id_user}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {getRoleIcon(user.role_user)}
                        <span className={getRoleBadge(user.role_user)} style={{ marginLeft: '0.5rem' }}>
                          {user.role_user}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        className="admin-button admin-button-danger"
                        onClick={() => {
                          if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.first_name} ${user.last_name} ?`)) {
                            handleDeleteUser(user.id_user);
                          }
                        }}
                        style={{ fontSize: '0.8rem' }}
                      >
                        <FaTrash style={{ marginRight: '0.3rem' }} />
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
