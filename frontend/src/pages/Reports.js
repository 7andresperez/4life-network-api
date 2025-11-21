import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { affiliatesAPI } from '../services/api';
import './Reports.css';

const Reports = () => {
  const { id } = useParams();
  const [affiliate, setAffiliate] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadReport(id);
    } else {
      loadRootReport();
    }
  }, [id]);

  const loadRootReport = async () => {
    try {
      const response = await affiliatesAPI.getAll();
      const affiliates = response.data.data;
      const rootAffiliate = affiliates.find(a => !a.parent_id) || affiliates[0];
      if (rootAffiliate) {
        loadReport(rootAffiliate.id);
      } else {
        setError('No se encontraron afiliados');
        setLoading(false);
      }
    } catch (err) {
      setError('Error al cargar datos');
      setLoading(false);
    }
  };

  const loadReport = async (affiliateId) => {
    try {
      setLoading(true);
      setError(null);
      const [affiliateRes, reportRes] = await Promise.all([
        affiliatesAPI.getById(affiliateId),
        affiliatesAPI.getReportByLevels(affiliateId)
      ]);
      
      setAffiliate(affiliateRes.data.data);
      setReport(reportRes.data.data);
      setLoading(false);
    } catch (err) {
      setError('Error al generar el reporte');
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    // Implementar exportación PDF
    alert('Funcionalidad de exportación PDF en desarrollo');
  };

  if (loading) {
    return <div className="loading">Generando reporte...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="reports-page">
      <h1>Reportes por Niveles</h1>

      {affiliate && (
        <div className="container">
          <div className="affiliate-header">
            <h2>{affiliate.name}</h2>
            <p>Código: {affiliate.code}</p>
          </div>
        </div>
      )}

      {report && report.length > 0 && (
        <div className="container">
          <div className="report-header">
            <h2>Estadísticas por Nivel</h2>
            <button onClick={handleExportPDF} className="btn btn-primary">
              Exportar PDF
            </button>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Nivel</th>
                <th>Total Afiliados</th>
                <th>Total Puntos</th>
                <th>Promedio Puntos</th>
                <th>Rangos Distintos</th>
              </tr>
            </thead>
            <tbody>
              {report.map((levelData) => (
                <tr key={levelData.level}>
                  <td>{levelData.level}</td>
                  <td>{levelData.total_affiliates}</td>
                  <td>{parseInt(levelData.total_points) || 0}</td>
                  <td>{parseFloat(levelData.avg_points || 0).toFixed(2)}</td>
                  <td>{levelData.distinct_ranks}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="report-summary">
            <h3>Resumen</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Total de Afiliados:</span>
                <span className="summary-value">
                  {report.reduce((sum, level) => sum + parseInt(level.total_affiliates), 0)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total de Puntos:</span>
                <span className="summary-value">
                  {report.reduce((sum, level) => sum + parseInt(level.total_points || 0), 0)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Niveles:</span>
                <span className="summary-value">{report.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

