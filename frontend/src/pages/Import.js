import React, { useState } from 'react';
import { csvAPI } from '../services/api';
import './Import.css';

const Import = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Por favor seleccione un archivo CSV');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor seleccione un archivo');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await csvAPI.import(file);
      setResult(response.data);
      setFile(null);
      // Reset file input
      document.getElementById('csv-file').value = '';
    } catch (err) {
      setError(err.response?.data?.message || 'Error al importar el archivo CSV');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `Código,Nombre,Email,Teléfono,Rango,Puntos,Código Padre
A001,Juan Pérez,juan@example.com,3001234567,Platino,35000,
A002,María González,maria@example.com,3002345678,Oro,20000,A001
A003,Carlos Rodríguez,carlos@example.com,3003456789,Plata,8000,A001`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_afiliados.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="import-page">
      <h1>Importar Afiliados desde CSV</h1>

      <div className="container">
        <div className="import-info">
          <h2>Instrucciones</h2>
          <ul>
            <li>El archivo CSV debe tener las siguientes columnas: Código, Nombre, Email, Teléfono, Rango, Puntos, Código Padre</li>
            <li>El código debe ser único para cada afiliado</li>
            <li>El código padre debe corresponder a un afiliado existente (dejar vacío para afiliados raíz)</li>
            <li>Los rangos deben coincidir con los rangos existentes en el sistema</li>
          </ul>
          <button onClick={downloadTemplate} className="btn btn-secondary">
            Descargar Plantilla CSV
          </button>
        </div>

        <form onSubmit={handleSubmit} className="import-form">
          <div className="form-group">
            <label htmlFor="csv-file">Seleccionar archivo CSV:</label>
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="input"
              disabled={loading}
            />
            {file && (
              <p className="file-info">Archivo seleccionado: {file.name}</p>
            )}
          </div>

          {error && <div className="error">{error}</div>}
          {result && (
            <div className="success">
              <h3>Importación completada</h3>
              <p>Registros procesados: {result.imported}</p>
              {result.errors > 0 && (
                <div>
                  <p>Errores: {result.errors}</p>
                  {result.errorDetails && result.errorDetails.length > 0 && (
                    <ul>
                      {result.errorDetails.map((err, idx) => (
                        <li key={idx}>Fila {err.row}: {err.error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !file}
          >
            {loading ? 'Importando...' : 'Importar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Import;

