import { Users, CheckCircle, Clock, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Header from "@/components/Header";
import SolicitacaoOrcamentoForm from "@/components/forms/SolicitacaoOrcamentoForm";

const Consultoria = () => {
  const [formOpen, setFormOpen] = useState(false);

  const servicos = [
    {
      titulo: "Consultoria Tributária",
      descricao: "Análise completa da situação tributária da sua empresa",
      itens: ["Revisão de tributos", "Planejamento tributário", "Recuperação de créditos", "Defesa em fiscalizações"]
    },
    {
      titulo: "Implantação de Sistemas",
      descricao: "Implementação e configuração de sistemas fiscais",
      itens: ["Análise de necessidades", "Configuração personalizada", "Treinamento da equipe", "Suporte pós-implantação"]
    },
    {
      titulo: "Auditoria Fiscal",
      descricao: "Verificação detalhada dos processos fiscais",
      itens: ["Auditoria preventiva", "Identificação de riscos", "Relatório de conformidade", "Plano de ação corretiva"]
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
                Consultoria Especializada
              </h1>
              <p className="text-xl text-slate-600">
                Expertise fiscal para impulsionar seu negócio
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {servicos.map((servico, index) => (
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-slate-800">{servico.titulo}</CardTitle>
                    <p className="text-slate-600">{servico.descricao}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {servico.itens.map((item, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                      onClick={() => setFormOpen(true)}
                    >
                      Solicitar Orçamento
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-700">
                    <Clock className="w-6 h-6 mr-3" />
                    Por que escolher nossa consultoria?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                      <span className="text-slate-600">Mais de 12 anos de experiência no mercado</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                      <span className="text-slate-600">Equipe especializada em diversos segmentos</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                      <span className="text-slate-600">Metodologia comprovada e personalizada</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                      <span className="text-slate-600">Acompanhamento contínuo dos resultados</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-emerald-700">
                    <Award className="w-6 h-6 mr-3" />
                    Nossos Resultados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center border-b pb-3">
                      <span className="text-3xl font-bold text-blue-600">500+</span>
                      <p className="text-sm text-slate-600">Empresas atendidas</p>
                    </div>
                    <div className="text-center border-b pb-3">
                      <span className="text-3xl font-bold text-emerald-600">R$ 50M</span>
                      <p className="text-sm text-slate-600">Em economia tributária</p>
                    </div>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-purple-600">98%</span>
                      <p className="text-sm text-slate-600">Taxa de satisfação</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-center text-slate-800">
                  Pronto para otimizar sua gestão fiscal?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 mb-6">
                  Entre em contato conosco e descubra como podemos ajudar sua empresa a crescer com segurança fiscal.
                </p>
                <div className="space-x-4">
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                    onClick={() => setFormOpen(true)}
                  >
                    Agendar Consulta Gratuita
                  </Button>
                  <Button variant="outline">
                    Falar com Especialista
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SolicitacaoOrcamentoForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
      />
    </>
  );
};

export default Consultoria;
