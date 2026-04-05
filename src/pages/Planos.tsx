import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SubHeader from "@/components/SubHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface PlanoDB {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number | null;
  tipo: string;
  recursos: string[] | null;
  ativo: boolean | null;
}

const RECURSOS_GRATUITO = [
  { texto: "Acesso a notícias e resumos básicos", incluido: true },
  { texto: "5 artigos completos por mês", incluido: true },
  { texto: "Ferramentas limitadas", incluido: true },
  { texto: "Comentários técnicos completos", incluido: false },
  { texto: "Alertas personalizados", incluido: false },
  { texto: "Boletins exclusivos", incluido: false },
  { texto: "Certificados", incluido: false },
  { texto: "Suporte prioritário", incluido: false },
];

const RECURSOS_PREMIUM = [
  { texto: "Acesso ilimitado a todo conteúdo", incluido: true },
  { texto: "Comentários técnicos completos", incluido: true },
  { texto: "Todas as ferramentas", incluido: true },
  { texto: "Boletins semanais exclusivos", incluido: true },
  { texto: "Alertas personalizados", incluido: true },
  { texto: "Certificados de atualização", incluido: true },
  { texto: "Suporte por e-mail", incluido: true },
  { texto: "Acesso API", incluido: false },
];

const RECURSOS_CORPORATIVO = [
  { texto: "Tudo do Premium Individual", incluido: true },
  { texto: "Até 10 usuários", incluido: true },
  { texto: "Autoavaliações de conformidade", incluido: true },
  { texto: "Consultoria mensal (1h)", incluido: true },
  { texto: "Suporte prioritário", incluido: true },
  { texto: "Dashboard gerencial", incluido: true },
  { texto: "Acesso API (em breve)", incluido: true },
  { texto: "Treinamento in company", incluido: true },
];

const getRecursosPorPlano = (nome: string) => {
  if (nome.toLowerCase().includes('gratuito')) return RECURSOS_GRATUITO;
  if (nome.toLowerCase().includes('corporativo')) return RECURSOS_CORPORATIVO;
  return RECURSOS_PREMIUM;
};

const Planos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [planos, setPlanos] = useState<PlanoDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlanos = async () => {
      const { data, error } = await supabase
        .from('planos_assinatura')
        .select('*')
        .eq('ativo', true)
        .order('preco', { ascending: true });
      
      if (!error && data) {
        setPlanos(data.map(p => ({
          ...p,
          recursos: Array.isArray(p.recursos) ? p.recursos as string[] : null
        })));
      }
      setLoading(false);
    };
    fetchPlanos();
  }, []);

  const handleAssinar = async (plano: PlanoDB) => {
    if (!user) {
      toast({
        title: "Faça login primeiro",
        description: "Você precisa estar logado para assinar um plano.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    setCheckoutLoading(plano.id);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plano_id: plano.id }
      });

      if (error) throw error;

      if (data.type === 'free') {
        toast({ title: "✅ Plano ativado!", description: data.message });
      } else if (data.type === 'pending') {
        toast({ title: "📋 Solicitação registrada", description: data.message });
      } else if (data.type === 'checkout') {
        toast({ title: "💳 Redirecionando...", description: data.message });
        if (data.checkout_url) {
          window.open(data.checkout_url, '_blank');
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Erro ao processar",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setCheckoutLoading(null);
    }
  };

  const formatPreco = (preco: number | null) => {
    if (preco === null || preco === 0) return "R$ 0";
    return `R$ ${preco.toFixed(2).replace('.', ',')}`;
  };

  const isPopular = (nome: string) => nome.toLowerCase().includes('individual');

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

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {planos.map((plano) => {
              const popular = isPopular(plano.nome);
              const recursos = getRecursosPorPlano(plano.nome);
              const isLoading = checkoutLoading === plano.id;

              return (
                <Card key={plano.id} className={`relative ${popular ? 'border-primary border-2 shadow-xl' : ''}`}>
                  {popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Mais Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl mb-2">{plano.nome}</CardTitle>
                    <CardDescription>{plano.descricao}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{formatPreco(plano.preco)}</span>
                      <span className="text-gray-600">/mês</span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {recursos.map((recurso, index) => (
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
                      variant={popular ? "default" : "outline"}
                      size="lg"
                      disabled={isLoading}
                      onClick={() => handleAssinar(plano)}
                    >
                      {isLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</>
                      ) : (
                        plano.preco === 0 ? "Começar Grátis" : "Assinar Agora"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

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
