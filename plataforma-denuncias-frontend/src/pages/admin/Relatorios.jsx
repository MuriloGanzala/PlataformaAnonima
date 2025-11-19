import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, TrendingUp } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../lib/api';

function Relatorios() {
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
      setDenuncias(denunciasRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportarCSV = () => {
    if (denuncias.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }

    const headers = ['Protocolo', 'Categoria', 'Urgência', 'Status', 'Data', 'Local', 'Descrição'];
    const rows = denuncias.map(d => [
      d.protocolo,
      d.categoria,
      d.urgencia,
      d.status,
      new Date(d.data_criacao).toLocaleString('pt-BR'),
      d.local || '',
      d.descricao.replace(/"/g, '""')
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_denuncias_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportarJSON = () => {
    if (!stats) {
      alert('Não há dados para exportar.');
      return;
    }

    const relatorio = {
      data_geracao: new Date().toISOString(),
      estatisticas: stats,
      total_denuncias: denuncias.length
    };

    const blob = new Blob([JSON.stringify(relatorio, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_estatisticas_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Relatórios</h1>
            <p className="text-gray-600 mt-1">Estatísticas e análises do sistema</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportarCSV} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
          <Button onClick={exportarJSON} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar JSON
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <p className="text-blue-100 text-sm mb-1">Total de Denúncias</p>
          <p className="text-4xl font-bold">{stats?.total || 0}</p>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Sistema ativo</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg p-6">
          <p className="text-yellow-100 text-sm mb-1">Pendentes</p>
          <p className="text-4xl font-bold">
            {stats?.por_status.find(s => s.status === 'Pendente')?.quantidade || 0}
          </p>
          <p className="text-sm mt-2">Aguardando análise</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <p className="text-purple-100 text-sm mb-1">Em Análise</p>
          <p className="text-4xl font-bold">
            {stats?.por_status.find(s => s.status === 'Em Análise')?.quantidade || 0}
          </p>
          <p className="text-sm mt-2">Sendo processadas</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
          <p className="text-green-100 text-sm mb-1">Resolvidas</p>
          <p className="text-4xl font-bold">
            {stats?.por_status.find(s => s.status === 'Resolvida')?.quantidade || 0}
          </p>
          <p className="text-sm mt-2">Casos concluídos</p>
        </div>
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Denúncias por categoria */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Denúncias por Categoria</h2>
          {stats?.por_categoria && stats.por_categoria.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.por_categoria}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantidade" fill="#3B82F6" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
          )}
        </div>

        {/* Denúncias por status */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Distribuição por Status</h2>
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
                  label={(entry) => `${entry.status}: ${entry.quantidade}`}
                >
                  {stats.por_status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
          )}
        </div>

        {/* Denúncias por urgência */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Denúncias por Urgência</h2>
          {stats?.por_urgencia && stats.por_urgencia.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.por_urgencia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="urgencia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantidade" fill="#F59E0B" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
          )}
        </div>

        {/* Tabela resumo */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumo Geral</h2>
          <div className="space-y-4">
            <div className="border-b pb-3">
              <p className="text-sm text-gray-600 mb-1">Total de Denúncias</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.total || 0}</p>
            </div>

            <div className="border-b pb-3">
              <p className="text-sm text-gray-600 mb-2">Por Status</p>
              <div className="space-y-2">
                {stats?.por_status.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{item.status}</span>
                    <span className="font-semibold text-gray-800">{item.quantidade}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Por Urgência</p>
              <div className="space-y-2">
                {stats?.por_urgencia.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{item.urgencia}</span>
                    <span className="font-semibold text-gray-800">{item.quantidade}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="bg-blue-50 rounded-lg shadow-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Sobre os Relatórios
        </h3>
        <div className="text-blue-700 space-y-2">
          <p>• Os dados são atualizados em tempo real conforme novas denúncias são registradas</p>
          <p>• Você pode exportar os dados em formato CSV para análise em planilhas</p>
          <p>• O formato JSON contém as estatísticas agregadas do sistema</p>
          <p>• Use os filtros na página de Gerenciar Denúncias para análises mais específicas</p>
        </div>
      </div>
    </div>
  );
}

export default Relatorios;

