import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, Eye, Trash2, X } from 'lucide-react';
import api from '../../lib/api';

function GerenciarSugestoes() {
  const [sugestoes, setSugestoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sugestaoSelecionada, setSugestaoSelecionada] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoStatus, setNovoStatus] = useState('');
  const [resposta, setResposta] = useState('');

  useEffect(() => {
    carregarSugestoes();
  }, []);

  const carregarSugestoes = async () => {
    try {
      const response = await api.get('/sugestoes');
      setSugestoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar sugestões:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModal = (sugestao) => {
    setSugestaoSelecionada(sugestao);
    setNovoStatus(sugestao.status);
    setResposta(sugestao.resposta || '');
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setSugestaoSelecionada(null);
    setNovoStatus('');
    setResposta('');
  };

  const handleAtualizarSugestao = async () => {
    if (!sugestaoSelecionada) return;

    try {
      await api.put(`/sugestoes/${sugestaoSelecionada.id}`, {
        status: novoStatus,
        resposta: resposta
      });
      
      alert('Sugestão atualizada com sucesso!');
      handleFecharModal();
      carregarSugestoes();
    } catch (error) {
      alert('Erro ao atualizar sugestão: ' + (error.response?.data?.erro || error.message));
    }
  };

  const handleDeletarSugestao = async (id) => {
    if (!confirm('Tem certeza que deseja deletar esta sugestão?')) return;

    try {
      await api.delete(`/sugestoes/${id}`);
      alert('Sugestão deletada com sucesso!');
      carregarSugestoes();
    } catch (error) {
      alert('Erro ao deletar sugestão: ' + (error.response?.data?.erro || error.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Recebida':
        return 'bg-blue-100 text-blue-800';
      case 'Em Análise':
        return 'bg-yellow-100 text-yellow-800';
      case 'Implementada':
        return 'bg-green-100 text-green-800';
      case 'Arquivada':
        return 'bg-gray-100 text-gray-800';
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
      <div className="flex items-center gap-3">
        <Lightbulb className="w-8 h-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Sugestões</h1>
          <p className="text-gray-600 mt-1">Visualize e responda às sugestões recebidas</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-2xl font-bold text-gray-800">{sugestoes.length}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <p className="text-blue-600 text-sm">Recebidas</p>
          <p className="text-2xl font-bold text-blue-800">
            {sugestoes.filter(s => s.status === 'Recebida').length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <p className="text-yellow-600 text-sm">Em Análise</p>
          <p className="text-2xl font-bold text-yellow-800">
            {sugestoes.filter(s => s.status === 'Em Análise').length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <p className="text-green-600 text-sm">Implementadas</p>
          <p className="text-2xl font-bold text-green-800">
            {sugestoes.filter(s => s.status === 'Implementada').length}
          </p>
        </div>
      </div>

      {/* Lista de sugestões */}
      <div className="space-y-4">
        {sugestoes.length > 0 ? (
          sugestoes.map((sugestao) => (
            <div key={sugestao.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-mono font-semibold text-yellow-600">{sugestao.protocolo}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sugestao.status)}`}>
                      {sugestao.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                      {sugestao.categoria}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{sugestao.titulo}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{sugestao.descricao}</p>
                  <p className="text-sm text-gray-500">
                    Recebida em {new Date(sugestao.data_criacao).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAbrirModal(sugestao)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Ver/Responder
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeletarSugestao(sugestao.id)}
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
            <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhuma sugestão recebida ainda</p>
          </div>
        )}
      </div>

      {/* Modal de detalhes */}
      {modalAberto && sugestaoSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Detalhes da Sugestão</h2>
              <button onClick={handleFecharModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informações básicas */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Protocolo</p>
                  <p className="font-mono font-semibold text-lg">{sugestaoSelecionada.protocolo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Categoria</p>
                  <p className="font-semibold text-lg">{sugestaoSelecionada.categoria}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Data de Recebimento</p>
                  <p className="font-semibold">{new Date(sugestaoSelecionada.data_criacao).toLocaleString('pt-BR')}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Título</p>
                <p className="text-lg font-semibold text-gray-800 bg-gray-50 p-4 rounded-lg">{sugestaoSelecionada.titulo}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Descrição</p>
                <p className="bg-gray-50 p-4 rounded-lg">{sugestaoSelecionada.descricao}</p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={novoStatus}
                  onChange={(e) => setNovoStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Recebida">Recebida</option>
                  <option value="Em Análise">Em Análise</option>
                  <option value="Implementada">Implementada</option>
                  <option value="Arquivada">Arquivada</option>
                </select>
              </div>

              {/* Resposta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resposta/Feedback
                </label>
                <textarea
                  value={resposta}
                  onChange={(e) => setResposta(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adicione um feedback ou resposta sobre esta sugestão..."
                />
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <Button onClick={handleAtualizarSugestao} className="flex-1 bg-yellow-500 hover:bg-yellow-600">
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

export default GerenciarSugestoes;

