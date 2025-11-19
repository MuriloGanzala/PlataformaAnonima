import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Plus, Edit, Trash2, X } from 'lucide-react';
import api from '../../lib/api';

function GerenciarUsuarios({ usuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    senha: '',
    nome: '',
    email: '',
    perfil: 'Moderador',
    ativo: true
  });

  const isAdmin = usuario?.perfil === 'Admin';

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModalNovo = () => {
    setModoEdicao(false);
    setUsuarioSelecionado(null);
    setFormData({
      username: '',
      senha: '',
      nome: '',
      email: '',
      perfil: 'Moderador',
      ativo: true
    });
    setModalAberto(true);
  };

  const handleAbrirModalEditar = (user) => {
    setModoEdicao(true);
    setUsuarioSelecionado(user);
    setFormData({
      username: user.username,
      senha: '',
      nome: user.nome,
      email: user.email || '',
      perfil: user.perfil,
      ativo: user.ativo
    });
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setModoEdicao(false);
    setUsuarioSelecionado(null);
    setFormData({
      username: '',
      senha: '',
      nome: '',
      email: '',
      perfil: 'Moderador',
      ativo: true
    });
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.nome) {
      alert('Username e nome são obrigatórios.');
      return;
    }

    if (!modoEdicao && !formData.senha) {
      alert('Senha é obrigatória para novos usuários.');
      return;
    }

    try {
      if (modoEdicao) {
        await api.put(`/usuarios/${usuarioSelecionado.id}`, formData);
        alert('Usuário atualizado com sucesso!');
      } else {
        await api.post('/usuarios', formData);
        alert('Usuário criado com sucesso!');
      }
      
      handleFecharModal();
      carregarUsuarios();
    } catch (error) {
      alert('Erro ao salvar usuário: ' + (error.response?.data?.erro || error.message));
    }
  };

  const handleDeletar = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
      await api.delete(`/usuarios/${id}`);
      alert('Usuário deletado com sucesso!');
      carregarUsuarios();
    } catch (error) {
      alert('Erro ao deletar usuário: ' + (error.response?.data?.erro || error.message));
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gerenciar Usuários</h1>
            <p className="text-gray-600 mt-1">Gerencie os usuários do sistema</p>
          </div>
        </div>
        {isAdmin && (
          <Button onClick={handleAbrirModalNovo} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Usuário
          </Button>
        )}
      </div>

      {!isAdmin && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-800">
            Apenas administradores podem criar, editar ou deletar usuários.
          </p>
        </div>
      )}

      {/* Lista de usuários */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Perfil
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {isAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-mono font-semibold text-gray-800">{user.username}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-gray-800">{user.nome}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-gray-600">{user.email || '-'}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.perfil === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.perfil}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAbrirModalEditar(user)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Editar
                      </Button>
                      {user.id !== usuario?.id && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletar(user.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de criar/editar */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            <div className="bg-white border-b p-6 flex items-center justify-between rounded-t-lg">
              <h2 className="text-2xl font-bold text-gray-800">
                {modoEdicao ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              <button onClick={handleFecharModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={modoEdicao}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha {!modoEdicao && <span className="text-red-500">*</span>}
                  {modoEdicao && <span className="text-gray-500 text-xs">(deixe em branco para não alterar)</span>}
                </label>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!modoEdicao}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Perfil
                </label>
                <select
                  name="perfil"
                  value={formData.perfil}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Moderador">Moderador</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium text-gray-700">
                  Usuário ativo
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  {modoEdicao ? 'Salvar Alterações' : 'Criar Usuário'}
                </Button>
                <Button type="button" variant="outline" onClick={handleFecharModal}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GerenciarUsuarios;

