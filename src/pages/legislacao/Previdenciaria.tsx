import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import SubHeader from "@/components/SubHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Eye, FileText, Lock } from "lucide-react";
import { Conteudo } from "@/types/conteudo";
import { useToast } from "@/hooks/use-toast";

const Previdenciaria = () => {
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadConteudos();
  }, []);

  const loadConteudos = async () => {
    try {
      const { data, error } = await supabase
        .from('conteudos')
        .select('*')
        .eq('categoria', 'Previdenciaria')
        .eq('status', 'publicado')
        .order('data_publicacao', { ascending: false });

      if (error) throw error;
      setConteudos(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar conteúdos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Header />
      <SubHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Legislação Previdenciária</h1>
          <p className="text-lg text-gray-600">
            Acompanhe as atualizações sobre INSS, contribuições previdenciárias, benefícios e aposentadorias com análises técnicas detalhadas.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : conteudos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum conteúdo disponível no momento.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conteudos.map((conteudo) => (
              <Card key={conteudo.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={conteudo.destaque ? "default" : "secondary"}>
                      {conteudo.tipo}
                    </Badge>
                    {conteudo.nivel_acesso !== 'gratuito' && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        {conteudo.nivel_acesso}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{conteudo.titulo}</CardTitle>
                  {conteudo.numero_norma && (
                    <CardDescription className="font-semibold">
                      {conteudo.numero_norma}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {conteudo.resumo_executivo || 'Sem resumo disponível'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(conteudo.data_publicacao).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {conteudo.visualizacoes}
                    </div>
                  </div>

                  <Link to={`/artigo/${conteudo.id}`}>
                    <Button className="w-full">
                      Ler Mais
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Previdenciaria;
