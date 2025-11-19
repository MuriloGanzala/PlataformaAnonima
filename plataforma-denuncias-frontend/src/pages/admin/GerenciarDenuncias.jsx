import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Filter, Eye, Trash2, Edit, X } from 'lucide-react';
import api from '../../lib/api';

function GerenciarDenuncias() {
  const [denuncias, setDenuncias] = useState([]);
  const [denunciasFiltradas, setDenunciasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtros, setFiltros] = useState({
    categoria: '',
    status: '',
    urgencia: ''
  });
  const [denunciaSelecionada, setDenunciaSelecionada] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [novaAcao, setNovaAcao] = useState('');
  const [novoStatus, setNovoStatus] = useState('');

  useEffect(() => {
    carregarDenuncias();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [denuncias, busca, filtros]);

  const carregarDenuncias = async () => {
    try {
      const response = await api.get('/denuncias');
      setDenuncias(response.data);
    } catch (error) {
      console.error('Erro ao carregar denúncias:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...denuncias];

    // Filtro de busca
    if (busca) {
      resultado = resultado.filter(d =>
        d.protocolo.toLowerCase().includes(busca.toLowerCase()) ||
        d.categoria.toLowerCase().includes(busca.toLowerCase()) ||
        d.descricao.toLowerCase().includes(busca.toLowerCase())
      );
    }

    // Filtros específicos
    if (filtros.categoria) {
      resultado = resultado.filter(d => d.categoria === filtros.categoria);
    }
    if (filtros.status) {
      resultado = resultado.filter(d => d.status === filtros.status);
    }
    if (filtros.urgencia) {
      resultado = resultado.filter(d => d.urgencia === filtros.urgencia);
    }

    setDenunciasFiltradas(resultado);
  };

  const handleAbrirModal = (denuncia) => {
    setDenunciaSelecionada(denuncia);
    setNovoStatus(denuncia.status);
    setNovaAcao('');
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setDenunciaSelecionada(null);
    setNovaAcao('');
    setNovoStatus('');
  };

  const handleAtualizarDenuncia = async () => {
    if (!denunciaSelecionada) return;

    try {
      const dados = {
        status: novoStatus
      };

      if (novaAcao.trim()) {
        dados.nova_acao = novaAcao.trim();
      }

      await api.put(`/denuncias/${denunciaSelecionada.id}`, dados);
      
      alert('Denúncia atualizada com sucesso!');
      handleFecharModal();
      carregarDenuncias();
    } catch (error) {
      alert('Erro ao atualizar denúncia: ' + (error.response?.data?.erro || error.message));
    }
  };

  const handleDeletarDenuncia = async (id) => {
    if (!confirm('Tem certeza que deseja deletar esta denúncia?')) return;

    try {
      await api.delete(`/denuncias/${id}`);
      alert('Denúncia deletada com sucesso!');
      carregarDenuncias();
    } catch (error) {
      alert('Erro ao deletar denúncia: ' + (error.response?.data?.erro || error.message));
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Em Análise':
        return 'bg-blue-100 text-blue-800';
      case 'Resolvida':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Denúncias</h1>
        <p className="text-gray-600 mt-1">Visualize e gerencie todas as denúncias recebidas</p>
      </div>

      {/* Barra de busca e filtros */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Buscar por protocolo, categoria ou descrição..."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          <select
            value={filtros.categoria}
            onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas as categorias</option>
            <option value="Bullying">Bullying</option>
            <option value="Cyberbullying">Cyberbullying</option>
            <option value="Discriminação">Discriminação</option>
            <option value="Assédio">Assédio</option>
            <option value="Violência Física">Violência Física</option>
            <option value="Violência Psicológica">Violência Psicológica</option>
            <option value="Abuso Sexual">Abuso Sexual</option>
            <option value="Uso de Drogas">Uso de Drogas</option>
            <option value="Vandalismo">Vandalismo</option>
            <option value="Outros">Outros</option>
          </select>

          <select
            value={filtros.status}
            onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os status</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Análise">Em Análise</option>
            <option value="Resolvida">Resolvida</option>
          </select>

          <select
            value={filtros.urgencia}
            onChange={(e) => setFiltros({ ...filtros, urgencia: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas as urgências</option>
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>

          {(busca || filtros.categoria || filtros.status || filtros.urgencia) && (
            <Button
              variant="outline"
              onClick={() => {
                setBusca('');
                setFiltros({ categoria: '', status: '', urgencia: '' });
              }}
            >
              Limpar filtros
            </Button>
          )}
        </div>

        <p className="text-sm text-gray-600">
          Mostrando {denunciasFiltradas.length} de {denuncias.length} denúncias
        </p>
      </div>

      {/* Lista de denúncias */}
      <div className="space-y-4">
        {denunciasFiltradas.length > 0 ? (
          denunciasFiltradas.map((denuncia) => (
            <div key={denuncia.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-mono font-semibold text-blue-600 text-lg">{denuncia.protocolo}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgenciaColor(denuncia.urgencia)}`}>
                      {denuncia.urgencia}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(denuncia.status)}`}>
                      {denuncia.status}
                    </span>
                  </div>
                  <p className="text-gray-800 font-medium mb-2">{denuncia.categoria}</p>
                  <p className="text-gray-600 mb-2 line-clamp-2">{denuncia.descricao}</p>
                  {denuncia.local && (
                    <p className="text-sm text-gray-500">Local: {denuncia.local}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Registrada em {new Date(denuncia.data_criacao).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAbrirModal(denuncia)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Ver/Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeletarDenuncia(denuncia.id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">Nenhuma denúncia encontrada</p>
          </div>
        )}
      </div>

      {/* Modal de detalhes */}
      {modalAberto && denunciaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Detalhes da Denúncia</h2>
              <button onClick={handleFecharModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informações básicas */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Protocolo</p>
                  <p className="font-mono font-semibold text-lg">{denunciaSelecionada.protocolo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Categoria</p>
                  <p className="font-semibold text-lg">{denunciaSelecionada.categoria}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Urgência</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getUrgenciaColor(denunciaSelecionada.urgencia)}`}>
                    {denunciaSelecionada.urgencia}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Data de Registro</p>
                  <p className="font-semibold">{new Date(denunciaSelecionada.data_criacao).toLocaleString('pt-BR')}</p>
                </div>
                {denunciaSelecionada.local && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Local</p>
                    <p className="font-semibold">{denunciaSelecionada.local}</p>
                  </div>
                )}
                {denunciaSelecionada.data_incidente && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Data do Incidente</p>
                    <p className="font-semibold">{new Date(denunciaSelecionada.data_incidente).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Descrição</p>
                <p className="bg-gray-50 p-4 rounded-lg">{denunciaSelecionada.descricao}</p>
              </div>

              {denunciaSelecionada.pessoas_envolvidas && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Pessoas Envolvidas</p>
                  <p className="bg-gray-50 p-4 rounded-lg">{denunciaSelecionada.pessoas_envolvidas}</p>
                </div>
              )}

              {/* Histórico de ações */}
              {denunciaSelecionada.acoes && JSON.parse(denunciaSelecionada.acoes).length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Histórico de Ações</p>
                  <div className="space-y-2">
                    {JSON.parse(denunciaSelecionada.acoes).map((acao, index) => (
                      <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                        <p className="text-xs text-gray-600 mb-1">
                          {new Date(acao.data).toLocaleString('pt-BR')}
                        </p>
                        <p className="text-gray-800">{acao.acao}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Atualizar status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={novoStatus}
                  onChange={(e) => setNovoStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em Análise">Em Análise</option>
                  <option value="Resolvida">Resolvida</option>
                </select>
              </div>

              {/* Adicionar ação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adicionar Nova Ação
                </label>
                <textarea
                  value={novaAcao}
                  onChange={(e) => setNovaAcao(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva a ação tomada em relação a esta denúncia..."
                />
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <Button onClick={handleAtualizarDenuncia} className="flex-1">
                  Salvar Alterações
                </Button>
                <Button variant="outline" onClick={handleFecharModal}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GerenciarDenuncias;

