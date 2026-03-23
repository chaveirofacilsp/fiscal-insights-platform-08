import { useState, useMemo } from "react";
import Header from "@/components/Header";
import SubHeader from "@/components/SubHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertCircle, Filter } from "lucide-react";
import { getPrazosProximos } from "@/data/mockConteudos";

const CalendarioFiscal = () => {
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");
  const prazos = useMemo(() => {
    const all = getPrazosProximos();
    if (filtroCategoria === "todos") return all;
    return all.filter((p) => p.categoria === filtroCategoria);
  }, [filtroCategoria]);

  const getUrgencia = (dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffDias = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDias <= 3) return { nivel: "urgente", cor: "destructive" as const, dias: diffDias };
    if (diffDias <= 7) return { nivel: "atencao", cor: "secondary" as const, dias: diffDias };
    return { nivel: "normal", cor: "outline" as const, dias: diffDias };
  };

  const categorias = ["todos", "Fiscal", "Trabalhista", "Previdenciaria", "Contabil"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Header />
      <SubHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Calendário Fiscal</h1>
              <p className="text-muted-foreground">
                Prazos e obrigações fiscais, trabalhistas e previdenciárias
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Filter className="h-5 w-5 text-muted-foreground mt-1" />
          {categorias.map((cat) => (
            <Button
              key={cat}
              variant={filtroCategoria === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltroCategoria(cat)}
            >
              {cat === "todos" ? "Todos" : cat}
            </Button>
          ))}
        </div>

        {prazos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum prazo encontrado para o filtro selecionado.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {prazos.map((prazo) => {
              const urgencia = getUrgencia(prazo.data_vencimento);
              return (
                <Card
                  key={prazo.id}
                  className={`hover:shadow-lg transition-shadow border-l-4 ${
                    urgencia.nivel === "urgente"
                      ? "border-l-destructive bg-red-50/50"
                      : urgencia.nivel === "atencao"
                      ? "border-l-amber-500 bg-amber-50/50"
                      : "border-l-primary"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={urgencia.cor}>{prazo.categoria}</Badge>
                          {prazo.recorrencia && (
                            <Badge variant="outline" className="text-xs">{prazo.recorrencia}</Badge>
                          )}
                          {urgencia.nivel === "urgente" && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              URGENTE - {urgencia.dias} dias
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{prazo.titulo}</CardTitle>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                          <Clock className="h-4 w-4" />
                          {new Date(prazo.data_vencimento).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {urgencia.dias} dias restantes
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{prazo.descricao}</p>
                    {prazo.orgao_responsavel && (
                      <p className="text-xs text-muted-foreground mt-2">
                        <strong>Órgão:</strong> {prazo.orgao_responsavel}
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
