import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../lib/api';

function Sugestoes() {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: 'Geral',
  });

  const [protocolo, setProtocolo] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const categorias = [
    'Geral',
    'Infraestrutura',
    'Segurança',
    'Ensino',
    'Atividades',
    'Alimentação',
    'Tecnologia',
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

    if (!formData.titulo || !formData.descricao) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setEnviando(true);

    try {
      const response = await api.post('/sugestoes', formData);
      setProtocolo(response.data.protocolo);
      
      setFormData({
        titulo: '',
        descricao: '',
        categoria: 'Geral',
      });
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao enviar sugestão. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const handleCancelar = () => {
    setFormData({
      titulo: '',
      descricao: '',
      categoria: 'Geral',
    });
    setErro('');
    setProtocolo('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Cabeçalho */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <Lightbulb className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-blue-600 mb-3">Sugestões de Melhorias</h1>
            <p className="text-gray-700">
              Sua opinião é muito importante! Compartilhe suas ideias e sugestões para tornar nossa instituição ainda melhor. 
              Todas as sugestões são anônimas e serão cuidadosamente analisadas.
            </p>
          </div>
        </div>
      </div>

      {/* Mensagem de sucesso */}
      {protocolo && (
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-800 text-lg mb-2">Sugestão enviada com sucesso!</h3>
              <p className="text-green-700 mb-3">
                Obrigado por contribuir com suas ideias. Sua sugestão foi registrada e será analisada pela equipe.
              </p>
              <div className="bg-white p-4 rounded border-2 border-green-500">
                <p className="text-sm text-gray-600 mb-1">Protocolo:</p>
                <p className="text-2xl font-bold text-green-600">{protocolo}</p>
              </div>
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enviar Sugestão</h2>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título da Sugestão <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Melhorar a iluminação do pátio"
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição da Sugestão <span className="text-red-500">*</span>
          </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descreva sua sugestão com detalhes. Como ela pode melhorar nossa instituição?"
            required
          />
        </div>

        {/* Botões */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
            disabled={enviando}
          >
            {enviando ? 'Enviando...' : 'Enviar Sugestão'}
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

      {/* Informações adicionais */}
      <div className="bg-blue-50 rounded-lg shadow-lg p-6 mt-6">
        <h3 className="font-semibold text-blue-800 mb-3">Por que suas sugestões são importantes?</h3>
        <ul className="space-y-2 text-blue-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Ajudam a identificar áreas que precisam de melhorias</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Contribuem para um ambiente mais agradável e produtivo</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Demonstram o compromisso de todos com a melhoria contínua</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Podem resultar em mudanças reais e positivas</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sugestoes;

