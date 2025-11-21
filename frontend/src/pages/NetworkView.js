import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { affiliatesAPI } from '../services/api';
import NetworkTree from '../components/NetworkTree';
import './NetworkView.css';

const NetworkView = () => {
  const { id } = useParams();
  const [affiliate, setAffiliate] = useState(null);
  const [hierarchy, setHierarchy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxLevel, setMaxLevel] = useState(3);

  useEffect(() => {
    if (id) {
      loadHierarchy(id);
    } else {
      // Si no hay ID, cargar el primer afiliado raíz
      loadRootAffiliate();
    }
  }, [id, maxLevel]);

  const loadRootAffiliate = async () => {
    try {
      const response = await affiliatesAPI.getAll();
      const affiliates = response.data.data;
      const rootAffiliate = affiliates.find(a => !a.parent_id) || affiliates[0];
      if (rootAffiliate) {
        loadHierarchy(rootAffiliate.id);
      } else {
        setError('No se encontraron afiliados');
        setLoading(false);
      }
    } catch (err) {
      setError('Error al cargar afiliados');
      setLoading(false);
    }
  };

  const loadHierarchy = async (affiliateId) => {
    try {
      setLoading(true);
      setError(null);
      const [affiliateRes, hierarchyRes] = await Promise.all([
        affiliatesAPI.getById(affiliateId),
        affiliatesAPI.getHierarchy(affiliateId, maxLevel)
      ]);
      
      setAffiliate(affiliateRes.data.data);
      setHierarchy(hierarchyRes.data.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar la jerarquía');
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    // Implementar exportación PDF
    alert('Funcionalidad de exportación PDF en desarrollo');
  };

  const handleExportCSV = async () => {
    try {
      const response = await affiliatesAPI.export(id || affiliate?.id);
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `network_${id || affiliate?.id}_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error al exportar CSV');
    }
  };

  if (loading) {
    return <div className="loading">Cargando red...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="network-view">
      <div className="network-header">
        <h1>Visualización de Red</h1>
        {affiliate && (
          <div className="affiliate-info">
            <h2>{affiliate.name}</h2>
            <p>Código: {affiliate.code}</p>
            <p>Puntos: {affiliate.points || 0}</p>
          </div>
        )}
        <div className="network-controls">
          <label>
            Niveles máximos:
            <select 
              value={maxLevel} 
              onChange={(e) => setMaxLevel(parseInt(e.target.value))}
              className="input"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </label>
          <div className="export-buttons">
            <button onClick={handleExportPDF} className="btn btn-primary">
              Exportar PDF
            </button>
            <button onClick={handleExportCSV} className="btn btn-success">
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      <div className="network-container">
        {hierarchy && hierarchy.tree && (
          <NetworkTree data={hierarchy.tree} />
        )}
      </div>
    </div>
  );
};

export default NetworkView;

