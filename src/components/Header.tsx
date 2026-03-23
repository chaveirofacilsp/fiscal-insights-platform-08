import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Mail, Menu, ChevronDown, Briefcase, Shield, BookOpen, Receipt, Calculator, Calendar, Users, Crown } from "lucide-react";
import { useState } from "react";
import UserMenu from "./UserMenu";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <p className="text-xs text-muted-foreground">Legislação Interpretada e Aplicável</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link to="/">
              <Button variant="ghost" size="sm">Início</Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  Legislação <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 bg-background shadow-lg border">
                <DropdownMenuItem asChild>
                  <Link to="/legislacao/trabalhista" className="w-full flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Trabalhista
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/legislacao/previdenciaria" className="w-full flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Previdenciária
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/legislacao/contabil" className="w-full flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Contábil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/legislacao/fiscal" className="w-full flex items-center gap-2">
                    <Receipt className="h-4 w-4" /> Fiscal
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/ferramentas-uteis">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Calculator className="h-3 w-3" /> Ferramentas
              </Button>
            </Link>

            <Link to="/calendario-fiscal">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Prazos
              </Button>
            </Link>

            <Link to="/comunidade">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Users className="h-3 w-3" /> Comunidade
              </Button>
            </Link>

            <Link to="/planos">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-amber-600">
                <Crown className="h-3 w-3" /> Premium
              </Button>
            </Link>

            <Link to="/contato">
              <Button variant="ghost" size="sm">Contato</Button>
            </Link>
          </nav>

          <button
            className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pt-4 border-t space-y-1">
            {[
              { to: "/", label: "Início" },
              { to: "/legislacao/trabalhista", label: "Legislação Trabalhista" },
              { to: "/legislacao/previdenciaria", label: "Legislação Previdenciária" },
              { to: "/legislacao/contabil", label: "Legislação Contábil" },
              { to: "/legislacao/fiscal", label: "Legislação Fiscal" },
              { to: "/ferramentas-uteis", label: "Ferramentas e Simuladores" },
              { to: "/calendario-fiscal", label: "Calendário Fiscal" },
              { to: "/comunidade", label: "Comunidade" },
              { to: "/planos", label: "Premium" },
              { to: "/contato", label: "Contato" },
              { to: "/suporte", label: "Suporte" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block py-2 px-3 text-foreground hover:bg-secondary rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
