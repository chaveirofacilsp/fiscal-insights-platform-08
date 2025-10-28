import Header from "@/components/Header";
import SubHeader from "@/components/SubHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const Planos = () => {
  const planos = [
    {
      nome: "Gratuito",
      preco: "R$ 0",
      periodo: "/mês",
      descricao: "Para conhecer a plataforma",
      popular: false,
      recursos: [
        { texto: "Acesso a notícias e resumos básicos", incluido: true },
        { texto: "5 artigos completos por mês", incluido: true },
        { texto: "Ferramentas limitadas", incluido: true },
        { texto: "Comentários técnicos completos", incluido: false },
        { texto: "Alertas personalizados", incluido: false },
        { texto: "Boletins exclusivos", incluido: false },
        { texto: "Certificados", incluido: false },
        { texto: "Suporte prioritário", incluido: false },
      ]
    },
    {
      nome: "Premium Individual",
      preco: "R$ 49,90",
      periodo: "/mês",
      descricao: "Para profissionais que buscam excelência",
      popular: true,
      recursos: [
        { texto: "Acesso ilimitado a todo conteúdo", incluido: true },
        { texto: "Comentários técnicos completos", incluido: true },
        { texto: "Todas as ferramentas", incluido: true },
        { texto: "Boletins semanais exclusivos", incluido: true },
        { texto: "Alertas personalizados", incluido: true },
        { texto: "Certificados de atualização", incluido: true },
        { texto: "Suporte por e-mail", incluido: true },
        { texto: "Acesso API", incluido: false },
      ]
    },
    {
      nome: "Premium Corporativo",
      preco: "R$ 199,90",
      periodo: "/mês",
      descricao: "Para escritórios e empresas",
      popular: false,
      recursos: [
        { texto: "Tudo do Premium Individual", incluido: true },
        { texto: "Até 10 usuários", incluido: true },
        { texto: "Autoavaliações de conformidade", incluido: true },
        { texto: "Consultoria mensal (1h)", incluido: true },
        { texto: "Suporte prioritário", incluido: true },
        { texto: "Dashboard gerencial", incluido: true },
        { texto: "Acesso API (em breve)", incluido: true },
        { texto: "Treinamento in company", incluido: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Header />
      <SubHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Escolha o plano ideal para você
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Acesse conteúdo interpretado, ferramentas práticas e mantenha-se sempre atualizado com a legislação fiscal e trabalhista
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {planos.map((plano) => (
            <Card key={plano.nome} className={`relative ${plano.popular ? 'border-primary border-2 shadow-xl' : ''}`}>
              {plano.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Mais Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plano.nome}</CardTitle>
                <CardDescription>{plano.descricao}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plano.preco}</span>
                  <span className="text-gray-600">{plano.periodo}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plano.recursos.map((recurso, index) => (
                    <li key={index} className="flex items-start gap-2">
                      {recurso.incluido ? (
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={recurso.incluido ? 'text-gray-700' : 'text-gray-400'}>
                        {recurso.texto}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={plano.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plano.preco === "R$ 0" ? "Começar Grátis" : "Assinar Agora"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Posso cancelar quando quiser?</h3>
                <p className="text-gray-600">
                  Sim! Você pode cancelar sua assinatura a qualquer momento, sem multas ou taxas de cancelamento.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Como funciona o período de teste?</h3>
                <p className="text-gray-600">
                  Você pode começar com o plano gratuito e fazer upgrade quando quiser para acessar todo o conteúdo.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Quais formas de pagamento são aceitas?</h3>
                <p className="text-gray-600">
                  Aceitamos cartão de crédito, PIX e boleto bancário. O pagamento é processado de forma segura.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Planos;
