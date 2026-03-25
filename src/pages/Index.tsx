import Header from "@/components/Header";
import SubHeader from "@/components/SubHeader";
import Hero from "@/components/Hero";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SearchSection from "@/components/SearchSection";
import ContentFeeds from "@/components/ContentFeeds";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Header />
      <SubHeader />

      <main className="container mx-auto px-4 py-6">
        {/* Layout 3 colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Esquerda */}
          <aside className="lg:col-span-3">
            <LeftSidebar />
          </aside>

          {/* Conteúdo Central */}
          <section className="lg:col-span-6 space-y-6">
            <Hero />
            <SearchSection />
            <ContentFeeds />
          </section>

          {/* Sidebar Direita */}
          <aside className="lg:col-span-3">
            <RightSidebar />
          </aside>
        </div>
      </main>

      {/* Footer com SEO */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-10 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Conecta Fisco</h3>
              <p className="text-slate-400 text-sm">
                Portal de legislação interpretada e aplicável para profissionais da contabilidade. Atualizações de legislação trabalhista, previdenciária, contábil e fiscal.
              </p>
            </div>
            <nav aria-label="Legislação">
              <h4 className="font-semibold mb-3">Legislação</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/legislacao/trabalhista" className="hover:text-white transition-colors">Legislação Trabalhista</a></li>
                <li><a href="/legislacao/previdenciaria" className="hover:text-white transition-colors">Legislação Previdenciária</a></li>
                <li><a href="/legislacao/contabil" className="hover:text-white transition-colors">Legislação Contábil</a></li>
                <li><a href="/legislacao/fiscal" className="hover:text-white transition-colors">Legislação Fiscal</a></li>
              </ul>
            </nav>
            <nav aria-label="Recursos">
              <h4 className="font-semibold mb-3">Recursos</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/ferramentas-uteis" className="hover:text-white transition-colors">Ferramentas e Simuladores</a></li>
                <li><a href="/calendario-fiscal" className="hover:text-white transition-colors">Calendário Fiscal</a></li>
                <li><a href="/comunidade" className="hover:text-white transition-colors">Comunidade</a></li>
                <li><a href="/cursos" className="hover:text-white transition-colors">Cursos para Contadores</a></li>
              </ul>
            </nav>
            <nav aria-label="Contato">
              <h4 className="font-semibold mb-3">Contato</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/contato" className="hover:text-white transition-colors">Fale Conosco</a></li>
                <li><a href="/suporte" className="hover:text-white transition-colors">Suporte</a></li>
                <li><a href="/planos" className="hover:text-white transition-colors">Planos e Assinaturas</a></li>
                <li><a href="/newsletter" className="hover:text-white transition-colors">Newsletter Contábil</a></li>
              </ul>
            </nav>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} Conecta Fisco - Soluções Fiscais Completas. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
