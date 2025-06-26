import { HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useState } from "react";
import { Link } from "react-router-dom";

const Suporte = () => {
  const canaisSuposte = [
    {
      titulo: "Chat Online",
      descricao: "Atendimento em tempo real",
      icone: MessageCircle,
      disponibilidade: "Seg-Sex: 8h às 18h",
      cor: "from-blue-500 to-blue-600"
    },
    {
      titulo: "Telefone",
      descricao: "Suporte via telefone",
      icone: Phone,
      disponibilidade: "(11) 3000-0000",
      cor: "from-emerald-500 to-emerald-600"
    },
    {
      titulo: "E-mail",
      descricao: "Envie sua dúvida por e-mail",
      icone: Mail,
      disponibilidade: "suporte@conectafisco.com.br",
      cor: "from-purple-500 to-purple-600"
    }
  ];

  const faqItems = [
    {
      pergunta: "Como posso cancelar minha assinatura?",
      resposta: "Você pode cancelar sua assinatura a qualquer momento através do painel do usuário ou entrando em contato conosco."
    },
    {
      pergunta: "Os cursos possuem certificado?",
      resposta: "Sim, todos os nossos cursos emitem certificado de conclusão válido em todo território nacional."
    },
    {
      pergunta: "Posso parcelar o pagamento dos cursos?",
      resposta: "Sim, oferecemos parcelamento em até 12x no cartão de crédito para a maioria dos nossos produtos."
    },
    {
      pergunta: "Como funciona o suporte técnico?",
      resposta: "Oferecemos suporte técnico através de chat, e-mail e telefone durante horário comercial."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Central de Suporte
            </h1>
            <p className="text-xl text-slate-600">
              Estamos aqui para ajudar você
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {canaisSuposte.map((canal, index) => {
              const IconComponent = canal.icone;
              return (
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${canal.cor} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-slate-800">{canal.titulo}</CardTitle>
                    <p className="text-slate-600">{canal.descricao}</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-slate-600 mb-4">{canal.disponibilidade}</p>
                    <Button 
                      className={`w-full bg-gradient-to-r ${canal.cor} hover:opacity-90`}
                    >
                      Iniciar Contato
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <HelpCircle className="w-6 h-6 mr-3 text-blue-600" />
                  Perguntas Frequentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border-b border-slate-200 pb-4 last:border-b-0">
                      <h3 className="font-semibold text-slate-800 mb-2">{item.pergunta}</h3>
                      <p className="text-slate-600 text-sm">{item.resposta}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" variant="outline">
                  Ver Todas as Perguntas
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Recursos de Autoajuda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg">
                    <h3 className="font-semibold text-slate-800 mb-2">Base de Conhecimento</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Acesse nossa biblioteca de artigos e tutoriais
                    </p>
                    <Button size="sm" variant="outline">Acessar</Button>
                  </div>

                  <div className="p-4 bg-white rounded-lg">
                    <h3 className="font-semibold text-slate-800 mb-2">Vídeos Tutoriais</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Aprenda através de vídeos explicativos
                    </p>
                    <Button size="sm" variant="outline">Assistir</Button>
                  </div>

                  <div className="p-4 bg-white rounded-lg">
                    <h3 className="font-semibold text-slate-800 mb-2">Comunidade</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Participe do fórum de discussões
                    </p>
                    <Button size="sm" variant="outline">Participar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-center text-slate-800">
                Não encontrou o que procurava?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 mb-6">
                Nossa equipe está pronta para ajudar você com qualquer dúvida ou problema.
              </p>
              <div className="space-x-4">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                  asChild
                >
                  <Link to="/contato">Entrar em Contato</Link>
                </Button>
                <Button variant="outline">
                  Agendar Ligação
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Suporte;
