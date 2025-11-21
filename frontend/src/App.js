import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import NetworkView from './pages/NetworkView';
import Search from './pages/Search';
import Import from './pages/Import';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/network/:id?" element={<NetworkView />} />
            <Route path="/search" element={<Search />} />
            <Route path="/import" element={<Import />} />
            <Route path="/reports/:id?" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

