import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, AlertCircle, MessageSquare, Users, FileText, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

function AdminLayout({ usuario, onLogout, children }) {
  const location = useLocation();
  const [sidebarAberto, setSidebarAberto] = useState(false);

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/denuncias', icon: AlertCircle, label: 'Denúncias' },
    { path: '/admin/sugestoes', icon: MessageSquare, label: 'Sugestões' },
    { path: '/admin/usuarios', icon: Users, label: 'Usuários' },
    { path: '/admin/relatorios', icon: FileText, label: 'Relatórios' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white shadow-lg">
        <div className="p-6 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">Painel Admin</h1>
          <p className="text-sm text-blue-100 mt-1">{usuario?.nome}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Link to="/">
            <Button variant="outline" className="w-full mb-2">
              Voltar ao Site
            </Button>
          </Link>
          <Button variant="destructive" className="w-full flex items-center gap-2" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Sidebar mobile */}
      {sidebarAberto && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setSidebarAberto(false)}>
          <aside className="w-64 h-full bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 bg-blue-600 text-white flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">Painel Admin</h1>
                <p className="text-sm text-blue-100 mt-1">{usuario?.nome}</p>
              </div>
              <button onClick={() => setSidebarAberto(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarAberto(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t absolute bottom-0 w-full bg-white">
              <Link to="/" onClick={() => setSidebarAberto(false)}>
                <Button variant="outline" className="w-full mb-2">
                  Voltar ao Site
                </Button>
              </Link>
              <Button variant="destructive" className="w-full flex items-center gap-2" onClick={() => { onLogout(); setSidebarAberto(false); }}>
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Header mobile */}
        <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button onClick={() => setSidebarAberto(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Painel Admin</h1>
          <div className="w-6"></div>
        </div>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;

