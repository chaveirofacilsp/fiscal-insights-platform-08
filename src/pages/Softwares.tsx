import { Computer, Download, Star, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";

const Softwares = () => {
  const softwares = [
    {
      nome: "ConectaFisco ERP",
      descricao: "Sistema completo de gestão fiscal e contábil",
      preco: "R$ 299,90/mês",
      recursos: ["Emissão de NFe", "SPED Fiscal", "Controle de Estoque", "Relatórios Gerenciais"],
      popular: true
    },
    {
      nome: "Calculadora Tributária Pro",
      descricao: "Ferramenta avançada para cálculos tributários",
      preco: "R$ 89,90/mês",
      recursos: ["Simples Nacional", "Lucro Real", "Lucro Presumido", "ICMS/IPI"],
      popular: false
    },
    {
      nome: "SPED Manager",
      descricao: "Geração e validação de arquivos SPED",
      preco: "R$ 149,90/mês",
      recursos: ["ECD", "ECF", "EFD Contribuições", "Validação Automática"],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Softwares Fiscais
            </h1>
            <p className="text-xl text-slate-600">
              Soluções tecnológicas para otimizar sua gestão fiscal
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {softwares.map((software, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="flex items-center text-slate-800">
                      <Computer className="w-6 h-6 mr-3 text-blue-600" />
                      {software.nome}
                    </CardTitle>
                    {software.popular && (
                      <Badge className="bg-gradient-to-r from-orange-400 to-red-400">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-600">{software.descricao}</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-blue-600">{software.preco}</span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-slate-700">Principais recursos:</h4>
                    <ul className="space-y-1">
                      {software.recursos.map((recurso, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-center">
                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                          {recurso}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                      Contratar Agora
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Teste Grátis 15 dias
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-12 bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 text-center justify-center">
                <Shield className="w-6 h-6 mr-3" />
                Garantia e Suporte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">30 dias de garantia</h3>
                  <p className="text-sm text-slate-600">
                    Não ficou satisfeito? Devolvemos seu dinheiro
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-700 mb-2">Suporte 24/7</h3>
                  <p className="text-sm text-slate-600">
                    Atendimento especializado sempre que precisar
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-700 mb-2">Atualizações incluídas</h3>
                  <p className="text-sm text-slate-600">
                    Sempre com as últimas mudanças na legislação
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Softwares;
