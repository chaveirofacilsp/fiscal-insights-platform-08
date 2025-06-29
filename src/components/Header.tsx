import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Phone, Mail, User, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import UserMenu from "./UserMenu";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-slate-700 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Mail className="w-3 h-3" />
              <span>contato@conectafisco.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CF</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Conecta Fisco</h1>
              <p className="text-sm text-slate-600">Soluções Fiscais Completas</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/quem-somos" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Quem Somos
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-slate-700 hover:text-blue-600 flex items-center space-x-1">
                  <span>Produtos</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white shadow-lg border border-slate-200">
                <DropdownMenuItem asChild>
                  <Link to="/softwares" className="w-full">Softwares</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/consultoria" className="w-full">Consultoria</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ferramentas" className="w-full">Ferramentas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ferramentas-uteis" className="w-full">Ferramentas Úteis</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/busca-avancada" className="w-full">Busca Avançada</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/cursos" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Cursos
            </Link>
            
            <Link to="/publicacoes" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Publicações
            </Link>
            
            <Link to="/contato" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Contato
            </Link>
            
            <Link to="/newsletter" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Newsletter
            </Link>
            
            <Link to="/suporte" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Suporte
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={toggleMenu}
          >
            <Menu className="w-6 h-6 text-slate-700" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pt-4 border-t border-slate-200 space-y-2">
            <Link 
              to="/quem-somos" 
              className="block py-2 text-slate-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Quem Somos
            </Link>
            <Link 
              to="/softwares" 
              className="block py-2 text-slate-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Softwares
            </Link>
            <Link 
              to="/consultoria" 
              className="block py-2 text-slate-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Consultoria
            </Link>
            <Link 
              to="/ferramentas" 
              className="block py-2 text-slate-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Ferramentas
            </Link>
            <Link 
              to="/cursos/ead" 
              className="block py-2 text-slate-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Cursos EAD
            </Link>
            <Link 
              to="/cursos/presencial" 
              className="block py-2 text-slate-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Cursos Presenciais
            </Link>
            <Link 
              to="/cursos/incompany" 
              className="block py-2 text-slate-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              In Company
            </Link>
            <Link 
              to="/contato" 
              className="block py-2 text-slate-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
            <Link 
              to="/newsletter" 
              className="block py-2 text-slate-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Newsletter
            </Link>
            <Link 
              to="/suporte" 
              className="block py-2 text-slate-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Suporte
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
