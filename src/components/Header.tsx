import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Mail, Menu } from "lucide-react";
import { useState } from "react";
import UserMenu from "./UserMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/quem-somos", label: "Quem Somos" },
    { to: "/softwares", label: "Produtos" },
    { to: "/publicacoes", label: "Publicações" },
    { to: "/cursos", label: "Cursos" },
    { to: "/contato", label: "Contato" },
    { to: "/newsletter", label: "Newsletter" },
    { to: "/suporte", label: "Suporte" },
  ];

  return (
    <header className="bg-background shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-slate-700 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-1">
            <Mail className="w-3 h-3" />
            <span>contato@conectafisco.com</span>
          </div>
          <UserMenu />
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CF</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Conecta Fisco</h1>
              <p className="text-xs text-muted-foreground">Soluções Fiscais Completas</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Menu principal">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button variant="ghost" size="sm">{link.label}</Button>
              </Link>
            ))}
          </nav>

          <button
            className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pt-4 border-t space-y-1" aria-label="Menu mobile">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 px-3 text-foreground hover:bg-secondary rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
