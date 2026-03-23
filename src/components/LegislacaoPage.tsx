import { useState, useMemo } from "react";
import Header from "@/components/Header";
import SubHeader from "@/components/SubHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Eye, FileText, Lock, Search, Lightbulb, BookOpen } from "lucide-react";
import { Conteudo, CategoriaConteudo } from "@/types/conteudo";
import { getConteudosByCategoria } from "@/data/mockConteudos";

interface LegislacaoPageProps {
  categoria: CategoriaConteudo;
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
}

const LegislacaoPage = ({ categoria, titulo, descricao, icone }: LegislacaoPageProps) => {
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const conteudos = useMemo(() => {
    let items = getConteudosByCategoria(categoria);
    if (busca) {
      const q = busca.toLowerCase();
      items = items.filter(
        (c) =>
          c.titulo.toLowerCase().includes(q) ||
          c.resumo_executivo?.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filtroTipo !== "todos") {
      items = items.filter((c) => c.tipo === filtroTipo);
    }
    return items;
  }, [categoria, busca, filtroTipo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Header />
      <SubHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Header da seção */}
        <div className="mb-8 flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">{icone}</div>
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">{titulo}</h1>
            <p className="text-muted-foreground">{descricao}</p>
          </div>
        </div>

        {/* Busca e filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, tema ou tag..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["todos", "legislacao", "artigo", "noticia", "comentario"].map((tipo) => (
              <Button
                key={tipo}
                variant={filtroTipo === tipo ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroTipo(tipo)}
                className="capitalize"
              >
                {tipo === "todos" ? "Todos" : tipo === "legislacao" ? "Legislação" : tipo === "artigo" ? "Artigos" : tipo === "noticia" ? "Notícias" : "Comentários"}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de conteúdos */}
        {conteudos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum conteúdo encontrado para os filtros selecionados.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {conteudos.map((conteudo) => (
              <Card
                key={conteudo.id}
                className="hover:shadow-lg transition-all cursor-pointer border-l-4"
                style={{
                  borderLeftColor: conteudo.destaque
                    ? "hsl(var(--primary))"
                    : "hsl(var(--border))",
                }}
                onClick={() => setExpandedId(expandedId === conteudo.id ? null : conteudo.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant={conteudo.destaque ? "default" : "secondary"}>
                          {conteudo.tipo === "legislacao" ? "📜 Legislação" : conteudo.tipo === "artigo" ? "📝 Artigo" : conteudo.tipo === "noticia" ? "📰 Notícia" : "💬 Comentário"}
                        </Badge>
                        {conteudo.numero_norma && (
                          <Badge variant="outline">{conteudo.numero_norma}</Badge>
                        )}
                        {conteudo.nivel_acesso !== "gratuito" && (
                          <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-300 bg-amber-50">
                            <Lock className="h-3 w-3" />
                            Premium
                          </Badge>
                        )}
                        {conteudo.destaque && (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
                            ⭐ Destaque
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl leading-tight">{conteudo.titulo}</CardTitle>
                      {conteudo.orgao_emissor && (
                        <CardDescription className="mt-1">
                          Órgão: {conteudo.orgao_emissor}
                        </CardDescription>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(conteudo.data_publicacao).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {conteudo.visualizacoes.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">
                    {conteudo.resumo_executivo || "Sem resumo disponível"}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {conteudo.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-secondary rounded-full text-secondary-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Conteúdo expandido */}
                  {expandedId === conteudo.id && (
                    <div className="mt-4 space-y-4 border-t pt-4">
                      {conteudo.comentario_tecnico && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2 text-blue-800 font-semibold">
                            <BookOpen className="h-4 w-4" />
                            Comentário Técnico
                          </div>
                          <p className="text-sm text-blue-900">{conteudo.comentario_tecnico}</p>
                        </div>
                      )}
                      {conteudo.exemplo_pratico && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2 text-emerald-800 font-semibold">
                            <Lightbulb className="h-4 w-4" />
                            Na Prática
                          </div>
                          <p className="text-sm text-emerald-900">{conteudo.exemplo_pratico}</p>
                        </div>
                      )}
                      {!conteudo.comentario_tecnico && !conteudo.exemplo_pratico && conteudo.nivel_acesso !== "gratuito" && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                          <Lock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                          <p className="text-sm text-amber-800 font-medium">
                            Comentários técnicos e exemplos práticos disponíveis no plano Premium
                          </p>
                          <Button size="sm" className="mt-2" onClick={(e) => { e.stopPropagation(); window.location.href = "/planos"; }}>
                            Conhecer Planos
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LegislacaoPage;
