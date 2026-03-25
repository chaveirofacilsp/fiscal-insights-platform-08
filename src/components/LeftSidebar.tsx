import { Calendar, ExternalLink, TrendingUp, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import AssinaturaPremiumForm from "./forms/AssinaturaPremiumForm";
import { fetchPrazos } from "@/data/mockConteudos";
import { PrazoObrigacao } from "@/types/conteudo";

const LeftSidebar = () => {
  const [premiumFormOpen, setPremiumFormOpen] = useState(false);
  const [prazos, setPrazos] = useState<PrazoObrigacao[]>([]);

  useEffect(() => {
    fetchPrazos().then(setPrazos);
  }, []);

  const handleProtectedClick = () => {
    setPremiumFormOpen(true);
  };

  const linksRapidos = [
    { nome: "Receita Federal", url: "https://www.gov.br/receitafederal", categoria: "Governo" },
    { nome: "Banco Central", url: "https://www.bcb.gov.br", categoria: "Governo" },
    { nome: "Portal eSocial", url: "https://www.gov.br/esocial", categoria: "Governo" },
    { nome: "SPED", url: "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/sped", categoria: "SPED" },
    { nome: "Simples Nacional", url: "https://www8.receita.fazenda.gov.br/simplesnacional", categoria: "Governo" },
    { nome: "CFC - Conselho Federal", url: "https://cfc.org.br", categoria: "Conselho" }
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Calendário Fiscal - dados do banco */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Calendar className="w-5 h-5" />
              <span>Calendário Fiscal</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {prazos.slice(0, 5).map((prazo) => (
              <div key={prazo.id} className="flex items-center justify-between border-l-4 border-blue-400 pl-3 py-2">
                <div>
                  <span className="font-medium text-slate-800">
                    {new Date(prazo.data_vencimento).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                  </span>
                  <p className="text-sm text-slate-600">{prazo.titulo}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {prazo.categoria}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" onClick={handleProtectedClick}>
              Ver Calendário Completo 👑
            </Button>
          </CardContent>
        </Card>

        {/* Links Rápidos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <ExternalLink className="w-5 h-5" />
              <span>Links Rápidos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {linksRapidos.map((link, index) => (
              <Button key={index} variant="ghost" size="sm" className="w-full justify-start hover:bg-blue-50 hover:text-blue-700" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {link.nome}
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Tendências */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <TrendingUp className="w-5 h-5" />
              <span>Em Alta</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-orange-700">
              <p className="font-medium">• Reforma Tributária IBS/CBS</p>
              <p className="font-medium">• eSocial versão S-1.2</p>
              <p className="font-medium">• EFD-Reinf R-4000</p>
              <p className="font-medium">• DIRPF 2026</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AssinaturaPremiumForm isOpen={premiumFormOpen} onClose={() => setPremiumFormOpen(false)} />
    </>
  );
};

export default LeftSidebar;
