import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Páginas públicas
import Home from './pages/Home';
import Acompanhamento from './pages/Acompanhamento';
import Sugestoes from './pages/Sugestoes';
import ApoioEmocional from './pages/ApoioEmocional';
import Login from './pages/Login';

// Páginas admin
import Dashboard from './pages/admin/Dashboard';
import GerenciarDenuncias from './pages/admin/GerenciarDenuncias';
import GerenciarUsuarios from './pages/admin/GerenciarUsuarios';
import Relatorios from './pages/admin/Relatorios';
import GerenciarSugestoes from './pages/admin/GerenciarSugestoes';

// Layout
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';

import api from './lib/api';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verificarAutenticacao();
  }, []);

  const verificarAutenticacao = async () => {
    try {
      const response = await api.get('/me');
      setUsuario(response.data);
    } catch (error) {
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (usuarioData) => {
    setUsuario(usuarioData);
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      setUsuario(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={
            <>
              <Navbar usuario={usuario} onLogout={handleLogout} />
              <Home />
            </>
          } />
          
          <Route path="/acompanhamento" element={
            <>
              <Navbar usuario={usuario} onLogout={handleLogout} />
              <Acompanhamento />
            </>
          } />
          
          <Route path="/sugestoes" element={
            <>
              <Navbar usuario={usuario} onLogout={handleLogout} />
              <Sugestoes />
            </>
          } />
          
          <Route path="/apoio-emocional" element={
            <>
              <Navbar usuario={usuario} onLogout={handleLogout} />
              <ApoioEmocional />
            </>
          } />
          
          <Route path="/login" element={
            usuario ? <Navigate to="/admin/dashboard" /> : <Login onLogin={handleLogin} />
          } />

          {/* Rotas admin */}
          <Route path="/admin/*" element={
            usuario ? (
              <AdminLayout usuario={usuario} onLogout={handleLogout}>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="denuncias" element={<GerenciarDenuncias />} />
                  <Route path="sugestoes" element={<GerenciarSugestoes />} />
                  <Route path="usuarios" element={<GerenciarUsuarios usuario={usuario} />} />
                  <Route path="relatorios" element={<Relatorios />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" />} />
                </Routes>
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

