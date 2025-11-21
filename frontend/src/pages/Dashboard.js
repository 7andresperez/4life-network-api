import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { affiliatesAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    loading: true,
    error: null
  });
  const [recentAffiliates, setRecentAffiliates] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await affiliatesAPI.getAll();
      const affiliates = response.data.data;
      setStats({
        total: affiliates.length,
        loading: false,
        error: null
      });
      setRecentAffiliates(affiliates.slice(0, 5));
    } catch (error) {
      setStats({
        total: 0,
        loading: false,
        error: 'Error al cargar datos'
      });
    }
  };

  if (stats.loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Afiliados</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Acciones Rápidas</h3>
          <div className="quick-actions">
            <Link to="/network" className="btn btn-primary">Ver Red</Link>
            <Link to="/import" className="btn btn-success">Importar CSV</Link>
            <Link to="/search" className="btn btn-secondary">Buscar</Link>
          </div>
        </div>
      </div>

      <div className="container">
        <h2>Afiliados Recientes</h2>
        {stats.error && <div className="error">{stats.error}</div>}
        {recentAffiliates.length > 0 ? (
          <table className="affiliates-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Rango</th>
                <th>Puntos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recentAffiliates.map((affiliate) => (
                <tr key={affiliate.id}>
                  <td>{affiliate.code}</td>
                  <td>{affiliate.name}</td>
                  <td>{affiliate.rank_id || 'N/A'}</td>
                  <td>{affiliate.points || 0}</td>
                  <td>
                    <Link 
                      to={`/network/${affiliate.id}`}
                      className="btn-link"
                    >
                      Ver Red
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay afiliados registrados</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

