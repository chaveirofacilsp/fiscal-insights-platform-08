import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import SubHeader from "@/components/SubHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { PrazoObrigacao } from "@/types/conteudo";
import { useToast } from "@/hooks/use-toast";

const CalendarioFiscal = () => {
  const [prazos, setPrazos] = useState<PrazoObrigacao[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPrazos();
  }, []);

  const loadPrazos = async () => {
    try {
      const { data, error } = await supabase
        .from('prazos_obrigacoes')
        .select('*')
        .gte('data_vencimento', new Date().toISOString())
        .order('data_vencimento', { ascending: true });

      if (error) throw error;
      setPrazos(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar prazos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUrgencia = (dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffDias = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDias <= 3) return { nivel: 'urgente', cor: 'destructive' };
    if (diffDias <= 7) return { nivel: 'atencao', cor: 'warning' };
    return { nivel: 'normal', cor: 'default' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Header />
      <SubHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Calendário Fiscal</h1>
          <p className="text-lg text-gray-600">
            Acompanhe todos os prazos e obrigações fiscais, trabalhistas e previdenciárias para não perder nenhum vencimento.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : prazos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum prazo próximo cadastrado.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {prazos.map((prazo) => {
              const urgencia = getUrgencia(prazo.data_vencimento);
              return (
                <Card key={prazo.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={urgencia.cor as any}>
                            {urgencia.nivel === 'urgente' && <AlertCircle className="h-3 w-3 mr-1" />}
                            {prazo.categoria}
                          </Badge>
                          {prazo.nivel_acesso !== 'gratuito' && (
                            <Badge variant="outline">{prazo.nivel_acesso}</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{prazo.titulo}</CardTitle>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                          <Clock className="h-4 w-4" />
                          {new Date(prazo.data_vencimento).toLocaleDateString('pt-BR')}
                        </div>
                        {urgencia.nivel === 'urgente' && (
                          <Badge variant="destructive" className="text-xs">
                            URGENTE
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2">{prazo.descricao}</p>
                    {prazo.orgao_responsavel && (
                      <p className="text-sm text-gray-500">
                        <strong>Órgão:</strong> {prazo.orgao_responsavel}
                      </p>
                    )}
                    {prazo.recorrencia && (
                      <p className="text-sm text-gray-500">
                        <strong>Recorrência:</strong> {prazo.recorrencia}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default CalendarioFiscal;
