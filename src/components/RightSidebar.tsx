
import { Calculator, Download, BookOpen, TrendingUp, DollarSign, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAdmin } from "@/contexts/AdminContext";

const RightSidebar = () => {
  const { indices } = useAdmin();

  const ferramentas = [
    { nome: "Calculadora de INSS", icone: Calculator, popular: true },
    { nome: "Simulador Simples Nacional", icone: Percent, popular: true },
    { nome: "Custo de Funcionário", icone: DollarSign, popular: false },
    { nome: "Alíquotas por Estado", icone: TrendingUp, popular: false },
    { nome: "Códigos de Receita", icone: BookOpen, popular: false }
  ];

  const publicacoes = [
    { titulo: "Manual do eSocial 2024", tipo: "PDF", tamanho: "2.5MB", premium: true },
    { titulo: "Guia SPED Fiscal", tipo: "PDF", tamanho: "1.8MB", premium: false },
    { titulo: "Tabela de Códigos NCM", tipo: "Excel", tamanho: "3.2MB", premium: true },
    { titulo: "Modelos de DARF", tipo: "Word", tamanho: "0.5MB", premium: false }
  ];

  return (
    <div className="space-y-6">
      {/* Ferramentas Úteis */}
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-emerald-800">
            <Calculator className="w-5 h-5" />
            <span>Ferramentas Úteis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ferramentas.map((ferramenta, index) => {
            const IconComponent = ferramenta.icone;
            return (
              <Button 
                key={index}
                variant="ghost" 
                className="w-full justify-start bg-white/80 hover:bg-white hover:text-emerald-700 border border-emerald-200"
              >
                <IconComponent className="w-4 h-4 mr-3" />
                <span className="flex-1 text-left">{ferramenta.nome}</span>
                {ferramenta.popular && (
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                    Popular
                  </Badge>
                )}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Publicações */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <BookOpen className="w-5 h-5" />
            <span>Publicações</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {publicacoes.map((pub, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm text-slate-800">{pub.titulo}</h4>
                {pub.premium && (
                  <Badge className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                    Premium
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>{pub.tipo} • {pub.tamanho}</span>
                <Button size="sm" variant="outline" className="h-6 px-2">
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full">
            Ver Todas as Publicações
          </Button>
        </CardContent>
      </Card>

      {/* Índices Econômicos - Agora dinâmicos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <TrendingUp className="w-5 h-5" />
            <span>Índices Econômicos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {indices.map((indice, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm text-slate-800">{indice.nome}</h4>
                <span className="text-lg font-bold text-slate-900">{indice.valor}</span>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${
                  indice.tipo === 'alta' ? 'text-red-600' : 
                  indice.tipo === 'baixa' ? 'text-green-600' : 'text-slate-600'
                }`}>
                  {indice.tipo === 'alta' ? '↗' : indice.tipo === 'baixa' ? '↘' : '→'} {indice.variacao}
                </span>
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-slate-200">
            <span className="text-xs text-slate-600">
              Atualizado em: {indices.length > 0 ? new Date(indices[0].ultimaAtualizacao).toLocaleDateString('pt-BR') : 'N/A'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Planos de Assinatura */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-purple-800">Upgrade Premium</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Uso mensal</span>
                <span>15/25 acessos</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="text-purple-700 font-medium">
                ✨ Com Premium você tem:
              </p>
              <ul className="space-y-1 text-purple-600">
                <li>• Acesso ilimitado</li>
                <li>• Todas as ferramentas</li>
                <li>• Downloads premium</li>
                <li>• Suporte prioritário</li>
              </ul>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Assinar Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSidebar;
