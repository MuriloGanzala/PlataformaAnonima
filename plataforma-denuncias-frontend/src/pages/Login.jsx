import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock, User, AlertCircle } from 'lucide-react';
import api from '../lib/api';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    senha: '',
  });
  const [erro, setErro] = useState('');
  const [entrando, setEntrando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!formData.username || !formData.senha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    setEntrando(true);

    try {
      const response = await api.post('/login', formData);
      onLogin(response.data.usuario);
      navigate('/admin/dashboard');
    } catch (error) {
      if (error.response?.status === 401) {
        setErro('Usuário ou senha incorretos.');
      } else if (error.response?.status === 403) {
        setErro('Usuário inativo. Entre em contato com o administrador.');
      } else {
        setErro('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setEntrando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-blue-100">Canal Seguro de Denúncia</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>

          {erro && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <p className="text-red-700">{erro}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={entrando}
            >
              {entrando ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Credenciais padrão: <br />
              <span className="font-mono font-semibold">admin / admin123</span>
            </p>
          </div>
        </div>

        {/* Voltar ao site */}
        <div className="text-center mt-6">
          <a href="/" className="text-white hover:text-blue-100 underline">
            Voltar ao site público
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;

