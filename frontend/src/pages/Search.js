import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { affiliatesAPI } from '../services/api';
import './Search.css';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchBy, setSearchBy] = useState('all'); // 'all', 'name', 'code', 'rank'

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError('Por favor ingrese un término de búsqueda');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await affiliatesAPI.search(searchTerm);
      let filteredResults = response.data.data;

      // Filtrar por tipo si es necesario
      if (searchBy === 'name') {
        filteredResults = filteredResults.filter(a => 
          a.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (searchBy === 'code') {
        filteredResults = filteredResults.filter(a => 
          a.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (searchBy === 'rank') {
        filteredResults = filteredResults.filter(a => 
          a.rank_name && a.rank_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setResults(filteredResults);
    } catch (err) {
      setError('Error al realizar la búsqueda');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <h1>Búsqueda de Afiliados</h1>

      <div className="container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-controls">
            <select 
              value={searchBy} 
              onChange={(e) => setSearchBy(e.target.value)}
              className="input"
            >
              <option value="all">Todo</option>
              <option value="name">Nombre</option>
              <option value="code">Código</option>
              <option value="rank">Rango</option>
            </select>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ingrese término de búsqueda..."
              className="input"
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>

        {error && <div className="error">{error}</div>}

        {results.length > 0 && (
          <div className="search-results">
            <h2>Resultados ({results.length})</h2>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Rango</th>
                  <th>Puntos</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {results.map((affiliate) => (
                  <tr key={affiliate.id}>
                    <td>{affiliate.code}</td>
                    <td>{affiliate.name}</td>
                    <td>{affiliate.rank_name || 'N/A'}</td>
                    <td>{affiliate.points || 0}</td>
                    <td>{affiliate.email || 'N/A'}</td>
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
          </div>
        )}

        {!loading && results.length === 0 && searchTerm && (
          <div className="no-results">
            <p>No se encontraron resultados para "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

