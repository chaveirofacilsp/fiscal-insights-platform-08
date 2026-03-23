import { Link } from "react-router-dom";
import Header from "@/components/Header";
import SubHeader from "@/components/SubHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase, Shield, BookOpen, Receipt, Calendar, Clock, Eye, AlertCircle,
  Calculator, FileText, Users, Crown, TrendingUp, ArrowRight, Lightbulb, LockKeyhole
} from "lucide-react";
import { getConteudosDestaque, getPrazosProximos } from "@/data/mockConteudos";

const Index = () => {
  const destaques = getConteudosDestaque();
  const prazos = getPrazosProximos().slice(0, 4);

  const areas = [
    { titulo: "Trabalhista", descricao: "CLT, eSocial, folha de pagamento", icone: Briefcase, cor: "bg-blue-500", link: "/legislacao/trabalhista" },
    { titulo: "Previdenciária", descricao: "INSS, contribuições, aposentadoria", icone: Shield, cor: "bg-emerald-500", link: "/legislacao/previdenciaria" },
    { titulo: "Contábil", descricao: "NBC, ECD, escrituração", icone: BookOpen, cor: "bg-violet-500", link: "/legislacao/contabil" },
    { titulo: "Fiscal", descricao: "Tributos, ICMS, reforma tributária", icone: Receipt, cor: "bg-amber-500", link: "/legislacao/fiscal" },
  ];

  const getUrgenciaDias = (data: string) => {
    const diff = Math.ceil((new Date(data).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Header />
      <SubHeader />

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-700 to-emerald-800 text-white p-8 md:p-12">
          <div className="relative z-10 max-w-3xl">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              🔔 Atualizado em {new Date().toLocaleDateString("pt-BR")}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Legislação interpretada e aplicável para contadores
            </h1>
            <p className="text-lg text-slate-300 mb-6">
              Acompanhe as mudanças legais com comentários técnicos, exemplos práticos e orientações para aplicação imediata no seu dia a dia contábil.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/legislacao/fiscal">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Explorar Conteúdos <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/planos">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Crown className="mr-2 h-4 w-4" /> Ver Planos
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <div className="w-full h-full bg-gradient-to-l from-emerald-400 to-transparent" />
          </div>
        </section>

        {/* Atalhos por área */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Áreas da Legislação</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {areas.map((area) => (
              <Link key={area.titulo} to={area.link}>
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                  <CardContent className="p-5 text-center">
                    <div className={`w-12 h-12 ${area.cor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                      <area.icone className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground">{area.titulo}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{area.descricao}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Grid: Destaques + Prazos */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Destaques */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" /> Destaques
              </h2>
            </div>
            {destaques.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">{item.categoria}</Badge>
                    <Badge variant="outline">{item.tipo === "legislacao" ? "Legislação" : "Artigo"}</Badge>
                    {item.nivel_acesso !== "gratuito" && (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-300">
                        <LockKeyhole className="h-3 w-3 mr-1" /> Premium
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">{item.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{item.resumo_executivo}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.data_publicacao).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.visualizacoes.toLocaleString()} views
                      </span>
                    </div>
                    <Link to={`/legislacao/${item.categoria.toLowerCase()}`}>
                      <Button variant="ghost" size="sm">
                        Ler mais <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Sidebar: Prazos + Atalhos */}
          <aside className="space-y-6">
            {/* Prazos próximos */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-destructive" />
                  Próximos Prazos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {prazos.map((prazo) => {
                  const dias = getUrgenciaDias(prazo.data_vencimento);
                  return (
                    <div key={prazo.id} className="border-b last:border-b-0 pb-3 last:pb-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground leading-tight">{prazo.titulo}</p>
                        <Badge variant={dias <= 7 ? "destructive" : "outline"} className="shrink-0 text-xs">
                          {dias}d
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(prazo.data_vencimento).toLocaleDateString("pt-BR")} • {prazo.categoria}
                      </p>
                    </div>
                  );
                })}
                <Link to="/calendario-fiscal">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Ver calendário completo <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Atalhos rápidos */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Acesso Rápido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/ferramentas-uteis" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Calculator className="mr-2 h-4 w-4" /> Ferramentas e Simuladores
                  </Button>
                </Link>
                <Link to="/comunidade" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" /> Comunidade
                  </Button>
                </Link>
                <Link to="/publicacoes" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" /> Publicações
                  </Button>
                </Link>
                <Link to="/planos" className="block">
                  <Button variant="outline" className="w-full justify-start text-amber-700">
                    <Crown className="mr-2 h-4 w-4" /> Assinar Premium
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Banner premium */}
            <Card className="bg-gradient-to-br from-slate-800 to-emerald-900 text-white border-0">
              <CardContent className="p-5 text-center">
                <Crown className="h-8 w-8 mx-auto mb-3 text-amber-400" />
                <h3 className="font-bold text-lg mb-2">Conecta Fisco Premium</h3>
                <p className="text-sm text-slate-300 mb-4">
                  Comentários completos, alertas automáticos, simuladores e certificados.
                </p>
                <Link to="/planos">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Conhecer Planos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-10 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Conecta Fisco</h3>
              <p className="text-slate-400 text-sm">
                Portal de legislação interpretada e aplicável para profissionais da contabilidade.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legislação</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/legislacao/trabalhista" className="hover:text-white transition-colors">Trabalhista</Link></li>
                <li><Link to="/legislacao/previdenciaria" className="hover:text-white transition-colors">Previdenciária</Link></li>
                <li><Link to="/legislacao/contabil" className="hover:text-white transition-colors">Contábil</Link></li>
                <li><Link to="/legislacao/fiscal" className="hover:text-white transition-colors">Fiscal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Recursos</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/ferramentas-uteis" className="hover:text-white transition-colors">Ferramentas</Link></li>
                <li><Link to="/calendario-fiscal" className="hover:text-white transition-colors">Calendário Fiscal</Link></li>
                <li><Link to="/comunidade" className="hover:text-white transition-colors">Comunidade</Link></li>
                <li><Link to="/cursos" className="hover:text-white transition-colors">Cursos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contato</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/contato" className="hover:text-white transition-colors">Fale Conosco</Link></li>
                <li><Link to="/suporte" className="hover:text-white transition-colors">Suporte</Link></li>
                <li><Link to="/planos" className="hover:text-white transition-colors">Planos</Link></li>
                <li><Link to="/newsletter" className="hover:text-white transition-colors">Newsletter</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} Conecta Fisco. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
