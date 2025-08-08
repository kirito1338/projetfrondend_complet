import React from "react";
import {
  FaTachometerAlt,
  FaRoute,
  FaUsers,
  FaExclamationTriangle,
  FaEnvelope,
  FaChartLine,
  FaCar,
  FaUserCheck,
} from "react-icons/fa";
import { useLang } from "../../LangContext";
import StatCard from "../components/StatCard";
import MontrealMapCard from "../components/MontrealMapCard";

export default function Dashboard({ stats }) {
  const { t } = useLang();
  
  return (
    <div className="admin-fade-in">
      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FaUsers />
          </div>
          <div className="admin-stat-number">{stats?.users || 0}</div>
          <div className="admin-stat-label">Utilisateurs Inscrits</div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FaRoute />
          </div>
          <div className="admin-stat-number">{stats?.rides || 0}</div>
          <div className="admin-stat-label">Trajets Proposés</div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="admin-stat-number">{stats?.pendingRides || 0}</div>
          <div className="admin-stat-label">Trajets à Valider</div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FaEnvelope />
          </div>
          <div className="admin-stat-number">{stats?.support || 0}</div>
          <div className="admin-stat-label">Demandes Support</div>
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="admin-content-card">
        <h3 style={{ 
          color: 'white', 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <FaChartLine style={{ marginRight: '0.5rem', color: '#ffd700' }} />
          Aperçu de l'Activité
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <FaCar style={{ fontSize: '2rem', color: '#48dbfb', marginBottom: '0.5rem' }} />
            <div style={{ color: 'white', fontWeight: '600' }}>Conducteurs Actifs</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>En temps réel</div>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <FaUserCheck style={{ fontSize: '2rem', color: '#ff9ff3', marginBottom: '0.5rem' }} />
            <div style={{ color: 'white', fontWeight: '600' }}>Taux de Satisfaction</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>95.2%</div>
          </div>
        </div>

        {/* Carte de Montréal */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '15px', 
          padding: '1rem',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h4 style={{ 
            color: 'white', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            🗺️ Zone de Couverture - Montréal
          </h4>
          <MontrealMapCard />
        </div>
      </div>
    </div>
  );
}
