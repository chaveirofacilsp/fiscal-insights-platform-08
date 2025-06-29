
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AssinaturaPremiumForm from "./forms/AssinaturaPremiumForm";

const SubHeader = () => {
  const [premiumFormOpen, setPremiumFormOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleMenuClick = (requiresAuth: boolean, requiresPremium: boolean, path?: string) => {
    if (requiresAuth && !user) {
      navigate('/auth');
      return;
    }
    
    if (path) {
      navigate(path);
      return;
    }
    
    if (requiresPremium) {
      setPremiumFormOpen(true);
    }
  };

  const menuItems = [
    {
      title: "SIMPLES",
      items: [
        { name: "Optantes", path: "/optantes" },
        { name: "Desenquadramento", path: "/desenquadramento" },
        { name: "Sublimites", path: "/sublimites" },
        { name: "Anexos", path: "/anexos" },
        { name: "Cálculo", path: "/calculo" }
      ]
    },
    {
      title: "IR",
      path: "/ir",
      items: [
        { name: "Pessoa Física", path: "/ir/pessoa-fisica" },
        { name: "Pessoa Jurídica", path: "/ir/pessoa-juridica" },
        { name: "Lucro Real", path: "/ir/lucro-real" },
        { name: "Lucro Presumido", path: "/ir/lucro-presumido" },
        { name: "Declarações", path: "/ir/declaracoes" }
      ]
    },
    {
      title: "PIS/COFINS",
      path: "/pis-cofins",
      items: [
        { name: "Cumulativo", path: "/pis-cofins/cumulativo" },
        { name: "Não Cumulativo", path: "/pis-cofins/nao-cumulativo" },
        { name: "Substituição Tributária", path: "/pis-cofins/substituicao-tributaria" },
        { name: "Créditos", path: "/pis-cofins/creditos" },
        { name: "Retenções", path: "/pis-cofins/retencoes" }
      ]
    },
    {
      title: "ICMS/ISS/IPI",
      path: "/icms-iss-ipi",
      items: [
        { name: "ICMS Estadual", path: "/icms-iss-ipi/icms-estadual" },
        { name: "ISS Municipal", path: "/icms-iss-ipi/iss-municipal" },
        { name: "IPI Federal", path: "/icms-iss-ipi/ipi-federal" },
        { name: "Substituição Tributária", path: "/icms-iss-ipi/substituicao-tributaria" },
        { name: "Benefícios", path: "/icms-iss-ipi/beneficios" }
      ]
    },
    {
      title: "Trabalho e Previdência",
      path: "/trabalho-previdencia",
      items: [
        { name: "eSocial", path: "/trabalho-previdencia/esocial" },
        { name: "FGTS", path: "/trabalho-previdencia/fgts" },
        { name: "Contribuições", path: "/trabalho-previdencia/contribuicoes" },
        { name: "Folha de Pagamento", path: "/trabalho-previdencia/folha-pagamento" },
        { name: "Benefícios", path: "/trabalho-previdencia/beneficios" }
      ]
    },
    {
      title: "Comercial",
      path: "/comercial",
      items: [
        { name: "Notas Fiscais", path: "/comercial/notas-fiscais" },
        { name: "Contratos", path: "/comercial/contratos" },
        { name: "Documentos", path: "/comercial/documentos" },
        { name: "Importação/Exportação", path: "/comercial/importacao-exportacao" }
      ]
    },
    {
      title: "SPED",
      path: "/sped",
      items: [
        { name: "ECD", path: "/sped/ecd" },
        { name: "ECF", path: "/sped/ecf" },
        { name: "EFD-Contribuições", path: "/sped/efd-contribuicoes" },
        { name: "EFD-ICMS/IPI", path: "/sped/efd-icms-ipi" },
        { name: "Reinf", path: "/sped/reinf" }
      ]
    },
    {
      title: "Declarações",
      path: "/declaracoes",
      items: [
        { name: "DARF", path: "/declaracoes/darf" },
        { name: "GFIP", path: "/declaracoes/gfip" },
        { name: "DIRF", path: "/declaracoes/dirf" },
        { name: "DME", path: "/declaracoes/dme" },
        { name: "Outras Declarações", path: "/declaracoes/outras" }
      ]
    },
    {
      title: "Contabilidade",
      path: "/contabilidade",
      items: [
        { name: "Balanço", path: "/contabilidade/balanco" },
        { name: "DRE", path: "/contabilidade/dre" },
        { name: "Plano de Contas", path: "/contabilidade/plano-contas" },
        { name: "Conciliações", path: "/contabilidade/conciliacoes" },
        { name: "Auditoria", path: "/contabilidade/auditoria" }
      ]
    },
    {
      title: "Reforma da Previdência",
      path: "/reforma-previdencia",
      items: [
        { name: "Novas Regras", path: "/reforma-previdencia/novas-regras" },
        { name: "Transição", path: "/reforma-previdencia/transicao" },
        { name: "Cálculos", path: "/reforma-previdencia/calculos" },
        { name: "Impactos", path: "/reforma-previdencia/impactos" },
        { name: "Orientações", path: "/reforma-previdencia/orientacoes" }
      ]
    }
  ];

  const menusComPremium = ["Contabilidade", "Reforma da Previdência"];

  return (
    <>
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 border-b border-slate-600">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-1 overflow-x-auto py-3">
            {menuItems.map((menu, index) => (
              <DropdownMenu key={index}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-slate-600 hover:text-white whitespace-nowrap text-sm font-medium flex items-center space-x-1 px-3 py-2"
                    onClick={() => {
                      if (menu.path) {
                        navigate(menu.path);
                      }
                    }}
                  >
                    <span>{menu.title}</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white shadow-lg border border-slate-200">
                  {menu.items.map((item, itemIndex) => (
                    <DropdownMenuItem
                      key={itemIndex}
                      className="hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                      onClick={() => {
                        handleMenuClick(
                          true, 
                          menusComPremium.includes(menu.title) && !item.path,
                          item.path
                        );
                      }}
                    >
                      {item.name}
                      {menusComPremium.includes(menu.title) && !item.path && (
                        <span className="ml-auto text-xs text-blue-600">👑</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>
        </div>
      </div>

      <AssinaturaPremiumForm
        isOpen={premiumFormOpen}
        onClose={() => setPremiumFormOpen(false)}
      />
    </>
  );
};

export default SubHeader;
