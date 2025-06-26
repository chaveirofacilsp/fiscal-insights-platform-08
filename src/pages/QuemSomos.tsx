import { Users, Target, Award, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { useState } from "react";

const QuemSomos = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Quem Somos
            </h1>
            <p className="text-xl text-slate-600">
              Conectando profissionais ao universo fiscal há mais de uma década
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <Target className="w-6 h-6 mr-3" />
                  Nossa Missão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Facilitar o acesso à informação fiscal de qualidade, oferecendo soluções 
                  completas e atualizadas para contadores, empresários e profissionais da 
                  área tributária, promovendo o crescimento e a conformidade fiscal.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-emerald-700">
                  <Award className="w-6 h-6 mr-3" />
                  Nossa Visão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Ser a principal referência em informações fiscais no Brasil, 
                  reconhecida pela excelência no atendimento, inovação tecnológica 
                  e compromisso com o sucesso de nossos clientes.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200 mb-12">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 text-center justify-center">
                <Heart className="w-6 h-6 mr-3" />
                Nossos Valores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="font-semibold text-blue-700 mb-2">Excelência</h3>
                  <p className="text-sm text-slate-600">
                    Buscamos sempre a mais alta qualidade em nossos produtos e serviços
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-emerald-700 mb-2">Inovação</h3>
                  <p className="text-sm text-slate-600">
                    Utilizamos tecnologia de ponta para facilitar o trabalho dos profissionais
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-purple-700 mb-2">Confiabilidade</h3>
                  <p className="text-sm text-slate-600">
                    Informações precisas e atualizadas são nossa principal prioridade
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <Users className="w-6 h-6 mr-3" />
                Nossa História
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600">
                <p className="leading-relaxed">
                  Fundada em 2012, a Conecta Fisco nasceu da necessidade de democratizar 
                  o acesso à informação fiscal de qualidade no Brasil. Começamos como uma 
                  pequena consultoria especializada e evoluímos para uma plataforma completa 
                  de soluções fiscais.
                </p>
                <p className="leading-relaxed">
                  Hoje, atendemos mais de 50.000 profissionais em todo o país, oferecendo 
                  desde consultoria especializada até softwares e ferramentas online que 
                  facilitam o dia a dia dos contadores e empresários.
                </p>
                <p className="leading-relaxed">
                  Nossa equipe é formada por especialistas em tributação, contabilidade 
                  e tecnologia, todos comprometidos em oferecer as melhores soluções 
                  para nossos clientes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuemSomos;
