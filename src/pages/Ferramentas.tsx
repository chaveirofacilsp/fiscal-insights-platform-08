
import { Calculator, FileText, TrendingUp, DollarSign, Percent, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useState } from "react";
import AssinaturaPremiumForm from "@/components/forms/AssinaturaPremiumForm";
import FerramentaPersonalizadaForm from "@/components/forms/FerramentaPersonalizadaForm";
import CalculadoraINSSForm from "@/components/forms/CalculadoraINSSForm";
import SimuladorSimplesForm from "@/components/forms/SimuladorSimplesForm";
import ConsultaCodigosForm from "@/components/forms/ConsultaCodigosForm";

const Ferramentas = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [premiumFormOpen, setPremiumFormOpen] = useState(false);
  const [ferramentaPersonalizadaOpen, setFerramentaPersonalizadaOpen] = useState(false);
  const [calculadoraINSSOpen, setCalculadoraINSSOpen] = useState(false);
  const [simuladorSimplesOpen, setSimuladorSimplesOpen] = useState(false);
  const [consultaCodigosOpen, setConsultaCodigosOpen] = useState(false);

  const ferramentas = [
    {
      nome: "Calculadora de INSS",
      descricao: "Calcule as contribuições previdenciárias de forma rápida e precisa",
      icone: Calculator,
      gratuita: true,
      popular: true,
      action: () => setCalculadoraINSSOpen(true)
    },
    {
      nome: "Simulador Simples Nacional",
      descricao: "Simule os tributos do Simples Nacional por faixa de faturamento",
      icone: Percent,
      gratuita: true,
      popular: true,
      action: () => setSimuladorSimplesOpen(true)
    },
    {
      nome: "Calculadora de Custo de Funcionário",
      descricao: "Calcule o custo real de um funcionário incluindo todos os encargos",
      icone: DollarSign,
      gratuita: false,
      popular: false,
      action: () => setPremiumFormOpen(true)
    },
    {
      nome: "Tabela de Alíquotas por Estado",
      descricao: "Consulte as alíquotas de ICMS, ISS e outros tributos por estado",
      icone: TrendingUp,
      gratuita: false,
      popular: false,
      action: () => setPremiumFormOpen(true)
    },
    {
      nome: "Gerador de DARF",
      descricao: "Gere DARFs automaticamente com cálculo de juros e multas",
      icone: FileText,
      gratuita: false,
      popular: false,
      action: () => setPremiumFormOpen(true)
    },
    {
      nome: "Consulta de Códigos de Receita",
      descricao: "Base completa de códigos de receita da Receita Federal",
      icone: FileText,
      gratuita: true,
      popular: false,
      action: () => setConsultaCodigosOpen(true)
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                Ferramentas Fiscais
              </h1>
              <p className="text-xl text-slate-600">
                Utilitários práticos para facilitar seu dia a dia fiscal
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ferramentas.map((ferramenta, index) => {
                const IconComponent = ferramenta.icone;
                return (
                  <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={ferramenta.action}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="flex items-center text-slate-800">
                          <IconComponent className="w-6 h-6 mr-3 text-blue-600" />
                          {ferramenta.nome}
                        </CardTitle>
                        <div className="flex flex-col space-y-1">
                          {ferramenta.popular && (
                            <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-xs">
                              Popular
                            </Badge>
                          )}
                          {ferramenta.gratuita ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                              Grátis
                            </Badge>
                          ) : (
                            <Badge className="bg-gradient-to-r from-purple-400 to-pink-400 text-xs">
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-600">{ferramenta.descricao}</p>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className={`w-full ${ferramenta.gratuita 
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        }`}
                        onClick={ferramenta.action}
                      >
                        {ferramenta.gratuita ? 'Usar Agora' : 'Assinar Premium'}
                        {!ferramenta.gratuita && <span className="ml-2">👑</span>}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="mt-12 bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-center text-slate-800">
                  Precisa de uma ferramenta específica?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 mb-6">
                  Nossa equipe pode desenvolver ferramentas personalizadas para suas necessidades específicas.
                </p>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                  onClick={() => setFerramentaPersonalizadaOpen(true)}
                >
                  Solicitar Ferramenta Personalizada
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AssinaturaPremiumForm
        isOpen={premiumFormOpen}
        onClose={() => setPremiumFormOpen(false)}
      />

      <FerramentaPersonalizadaForm
        isOpen={ferramentaPersonalizadaOpen}
        onClose={() => setFerramentaPersonalizadaOpen(false)}
      />

      <CalculadoraINSSForm
        isOpen={calculadoraINSSOpen}
        onClose={() => setCalculadoraINSSOpen(false)}
      />

      <SimuladorSimplesForm
        isOpen={simuladorSimplesOpen}
        onClose={() => setSimuladorSimplesOpen(false)}
      />

      <ConsultaCodigosForm
        isOpen={consultaCodigosOpen}
        onClose={() => setConsultaCodigosOpen(false)}
      />
    </>
  );
};

export default Ferramentas;
