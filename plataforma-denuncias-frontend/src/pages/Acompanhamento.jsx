import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, AlertCircle, CheckCircle2, Clock, FileText } from 'lucide-react';
import api from '../lib/api';

function Acompanhamento() {
  const [protocolo, setProtocolo] = useState('');
  const [denuncia, setDenuncia] = useState(null);
  const [erro, setErro] = useState('');
  const [buscando, setBuscando] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    setErro('');
    setDenuncia(null);

    if (!protocolo.trim()) {
      setErro('Por favor, informe o protocolo.');
      return;
    }

    setBuscando(true);

    try {
      const response = await api.get(`/denuncias/${protocolo.trim()}`);
      setDenuncia(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setErro('Protocolo não encontrado. Verifique se digitou corretamente.');
      } else {
        setErro('Erro ao buscar denúncia. Tente novamente.');
      }
    } finally {
      setBuscando(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pendente':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Em Análise':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'Resolvida':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Em Análise':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Resolvida':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Cabeçalho */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-3">Acompanhar Denúncia</h1>
        <p className="text-gray-700">
          Digite o protocolo que você recebeu ao fazer a denúncia para acompanhar o andamento.
        </p>
      </div>

      {/* Formulário de busca */}
      <form onSubmit={handleBuscar} className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Protocolo da Denúncia
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={protocolo}
            onChange={(e) => setProtocolo(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: DEN-2025-ABC123"
          />
          <Button type="submit" disabled={buscando} className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            {buscando ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>
      </form>

      {/* Mensagem de erro */}
      {erro && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <p className="text-red-700">{erro}</p>
          </div>
        </div>
      )}

      {/* Resultado da denúncia */}
      {denuncia && (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Detalhes da Denúncia</h2>
              <p className="text-sm text-gray-500 mt-1">
                Registrada em {new Date(denuncia.data_criacao).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getStatusColor(denuncia.status)}`}>
              {getStatusIcon(denuncia.status)}
              <span className="font-semibold">{denuncia.status}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Protocolo</h3>
              <p className="text-lg font-mono font-semibold text-gray-800">{denuncia.protocolo}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Categoria</h3>
              <p className="text-lg text-gray-800">{denuncia.categoria}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Urgência</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getUrgenciaColor(denuncia.urgencia)}`}>
                {denuncia.urgencia}
              </span>
            </div>

            {denuncia.local && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Local</h3>
                <p className="text-lg text-gray-800">{denuncia.local}</p>
              </div>
            )}

            {denuncia.data_incidente && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Data do Incidente</h3>
                <p className="text-lg text-gray-800">{new Date(denuncia.data_incidente).toLocaleDateString('pt-BR')}</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Descrição</h3>
            <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{denuncia.descricao}</p>
          </div>

          {denuncia.pessoas_envolvidas && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Pessoas Envolvidas</h3>
              <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{denuncia.pessoas_envolvidas}</p>
            </div>
          )}

          {/* Histórico de ações */}
          {denuncia.acoes && JSON.parse(denuncia.acoes).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Ações Tomadas</h3>
              <div className="space-y-3">
                {JSON.parse(denuncia.acoes).map((acao, index) => (
                  <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-gray-600 mb-1">
                      {new Date(acao.data).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-gray-800">{acao.acao}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {denuncia.status === 'Pendente' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-yellow-800">
                Sua denúncia foi recebida e está aguardando análise. Em breve a equipe responsável irá avaliar e tomar as medidas necessárias.
              </p>
            </div>
          )}

          {denuncia.status === 'Em Análise' && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-800">
                Sua denúncia está sendo analisada pela equipe responsável. Acompanhe as atualizações nesta página.
              </p>
            </div>
          )}

          {denuncia.status === 'Resolvida' && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-800">
                Esta denúncia foi resolvida. Agradecemos por ter contribuído para um ambiente mais seguro.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Acompanhamento;

