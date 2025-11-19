import { useState, useEffect } from 'react';
import { AlertCircle, MessageSquare, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../lib/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [relatorioRes, denunciasRes] = await Promise.all([
        api.get('/relatorios'),
        api.get('/denuncias')
      ]);

      setStats(relatorioRes.data);
      setDenuncias(denunciasRes.data.slice(0, 5)); // Últimas 5 denúncias
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const cards = [
    {
      titulo: 'Total de Denúncias',
      valor: stats?.total || 0,
      icon: AlertCircle,
      cor: 'bg-blue-500',
      corTexto: 'text-blue-600'
    },
    {
      titulo: 'Pendentes',
      valor: stats?.por_status.find(s => s.status === 'Pendente')?.quantidade || 0,
      icon: Clock,
      cor: 'bg-yellow-500',
      corTexto: 'text-yellow-600'
    },
    {
      titulo: 'Em Análise',
      valor: stats?.por_status.find(s => s.status === 'Em Análise')?.quantidade || 0,
      icon: TrendingUp,
      cor: 'bg-purple-500',
      corTexto: 'text-purple-600'
    },
    {
      titulo: 'Resolvidas',
      valor: stats?.por_status.find(s => s.status === 'Resolvida')?.quantidade || 0,
      icon: CheckCircle2,
      cor: 'bg-green-500',
      corTexto: 'text-green-600'
    }
  ];

  const getUrgenciaColor = (urgencia) => {
    switch (urgencia) {
      case 'Baixa':
        return 'bg-green-100 text-green-800';
      case 'Média':
        return 'bg-yellow-100 text-yellow-800';
      case 'Alta':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do sistema de denúncias</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.cor} p-3 rounded-lg text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{card.titulo}</p>
              <p className={`text-3xl font-bold ${card.corTexto}`}>{card.valor}</p>
            </div>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico por categoria */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Denúncias por Categoria</h2>
          {stats?.por_categoria && stats.por_categoria.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.por_categoria}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
          )}
        </div>

        {/* Gráfico por status */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Denúncias por Status</h2>
          {stats?.por_status && stats.por_status.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.por_status}
                  dataKey="quantidade"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.por_status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
          )}
        </div>
      </div>

      {/* Denúncias recentes */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Denúncias Recentes</h2>
        {denuncias.length > 0 ? (
          <div className="space-y-4">
            {denuncias.map((denuncia) => (
              <div key={denuncia.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-semibold text-blue-600">{denuncia.protocolo}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getUrgenciaColor(denuncia.urgencia)}`}>
                        {denuncia.urgencia}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium mb-1">{denuncia.categoria}</p>
                    <p className="text-gray-600 text-sm line-clamp-2">{denuncia.descricao}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(denuncia.data_criacao).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      denuncia.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                      denuncia.status === 'Em Análise' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {denuncia.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhuma denúncia registrada</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

