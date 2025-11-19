import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

function Navbar({ usuario, onLogout }) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600">
              🛡️
            </div>
            Canal Seguro
          </Link>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded transition">
              Fazer Denúncia
            </Link>
            <Link to="/acompanhamento" className="hover:bg-blue-700 px-3 py-2 rounded transition">
              Acompanhar
            </Link>
            <Link to="/sugestoes" className="hover:bg-blue-700 px-3 py-2 rounded transition">
              Sugestões
            </Link>
            
            <Link to="/apoio-emocional">
              <Button variant="destructive" size="sm" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Apoio Emocional
              </Button>
            </Link>

            {usuario ? (
              <>
                <Link to="/admin/dashboard">
                  <Button variant="secondary" size="sm">
                    Painel Admin
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={onLogout} className="text-white border-white hover:bg-blue-700">
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Login Admin
                </Button>
              </Link>
            )}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/apoio-emocional">
              <Button variant="destructive" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
            </Link>
            <button onClick={() => setMenuAberto(!menuAberto)} className="p-2">
              {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu mobile expandido */}
        {menuAberto && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block hover:bg-blue-700 px-3 py-2 rounded transition" onClick={() => setMenuAberto(false)}>
              Fazer Denúncia
            </Link>
            <Link to="/acompanhamento" className="block hover:bg-blue-700 px-3 py-2 rounded transition" onClick={() => setMenuAberto(false)}>
              Acompanhar
            </Link>
            <Link to="/sugestoes" className="block hover:bg-blue-700 px-3 py-2 rounded transition" onClick={() => setMenuAberto(false)}>
              Sugestões
            </Link>
            {usuario ? (
              <>
                <Link to="/admin/dashboard" className="block hover:bg-blue-700 px-3 py-2 rounded transition" onClick={() => setMenuAberto(false)}>
                  Painel Admin
                </Link>
                <button onClick={() => { onLogout(); setMenuAberto(false); }} className="block w-full text-left hover:bg-blue-700 px-3 py-2 rounded transition">
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login" className="block hover:bg-blue-700 px-3 py-2 rounded transition" onClick={() => setMenuAberto(false)}>
                Login Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

