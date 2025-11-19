import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';

function Home() {
  const [formData, setFormData] = useState({
    categoria: '',
    descricao: '',
    local: '',
    data_incidente: '',
    pessoas_envolvidas: '',
    urgencia: '',
  });

  const [protocolo, setProtocolo] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const categorias = [
    'Bullying',
    'Cyberbullying',
    'Discriminação',
    'Assédio',
    'Violência Física',
    'Violência Psicológica',
    'Abuso Sexual',
    'Uso de Drogas',
    'Vandalismo',
    'Outros'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setProtocolo('');

    // Validação
    if (!formData.categoria || !formData.descricao || !formData.urgencia) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (formData.descricao.length < 50) {
      setErro('A descrição deve ter pelo menos 50 caracteres.');
      return;
    }

    setEnviando(true);

    try {
      const response = await api.post('/denuncias', formData);
      setProtocolo(response.data.protocolo);
      
      // Limpa o formulário
      setFormData({
        categoria: '',
        descricao: '',
        local: '',
        data_incidente: '',
        pessoas_envolvidas: '',
        urgencia: '',
      });
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao enviar denúncia. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const handleCancelar = () => {
    setFormData({
      categoria: '',
      descricao: '',
      local: '',
      data_incidente: '',
      pessoas_envolvidas: '',
      urgencia: '',
    });
    setErro('');
    setProtocolo('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Cabeçalho */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-3">Canal Seguro de Denúncia</h1>
        <p className="text-gray-700 mb-4">
          Este é um canal 100% anônimo e seguro para você relatar situações que precisam de atenção. 
          Seu anonimato é garantido e nenhuma informação pessoal será coletada.
        </p>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Emergência?</h3>
              <p className="text-sm text-red-700">
                Se você está em perigo imediato, ligue para 190 (Polícia) ou 188 (CVV - Centro de Valorização da Vida).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagem de sucesso */}
      {protocolo && (
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-800 text-lg mb-2">Denúncia registrada com sucesso!</h3>
              <p className="text-green-700 mb-3">
                Sua denúncia foi recebida e será analisada pela equipe responsável. 
                Guarde o protocolo abaixo para acompanhar o andamento:
              </p>
              <div className="bg-white p-4 rounded border-2 border-green-500">
                <p className="text-sm text-gray-600 mb-1">Protocolo de Acompanhamento:</p>
                <p className="text-2xl font-bold text-green-600">{protocolo}</p>
              </div>
              <p className="text-sm text-green-700 mt-3">
                Você pode acompanhar sua denúncia na página de <a href="/acompanhamento" className="underline font-semibold">Acompanhamento</a>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de erro */}
      {erro && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <p className="text-red-700">{erro}</p>
          </div>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Formulário de Denúncia</h2>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria do Incidente <span className="text-red-500">*</span>
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição Detalhada <span className="text-red-500">*</span>
          </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descreva o que aconteceu com o máximo de detalhes possível (mínimo 50 caracteres)..."
            required
            minLength="50"
          />
          <p className="text-sm text-gray-500 mt-1">{formData.descricao.length} caracteres</p>
        </div>

        {/* Local */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Local do Incidente
          </label>
          <input
            type="text"
            name="local"
            value={formData.local}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Sala 201, Pátio, Banheiro do 2º andar..."
          />
        </div>

        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data do Incidente
          </label>
          <input
            type="date"
            name="data_incidente"
            value={formData.data_incidente}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Pessoas envolvidas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pessoas Envolvidas
          </label>
          <textarea
            name="pessoas_envolvidas"
            value={formData.pessoas_envolvidas}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Se souber, informe quem estava envolvido (vítimas, agressores, testemunhas)..."
          />
        </div>

        {/* Urgência */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nível de Urgência <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="urgencia"
                value="Baixa"
                checked={formData.urgencia === 'Baixa'}
                onChange={handleChange}
                className="w-4 h-4"
                required
              />
              <div>
                <span className="font-medium">Baixa</span>
                <p className="text-sm text-gray-600">Situação não urgente, mas que precisa de atenção</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="urgencia"
                value="Média"
                checked={formData.urgencia === 'Média'}
                onChange={handleChange}
                className="w-4 h-4"
                required
              />
              <div>
                <span className="font-medium">Média</span>
                <p className="text-sm text-gray-600">Situação que requer atenção em breve</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="urgencia"
                value="Alta"
                checked={formData.urgencia === 'Alta'}
                onChange={handleChange}
                className="w-4 h-4"
                required
              />
              <div>
                <span className="font-medium text-red-600">Alta</span>
                <p className="text-sm text-gray-600">Situação grave que requer ação imediata</p>
              </div>
            </label>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={enviando}
          >
            {enviando ? 'Enviando...' : 'Enviar Denúncia Anônima'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelar}
            disabled={enviando}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Home;

