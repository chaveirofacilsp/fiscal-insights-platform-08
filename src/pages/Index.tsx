import Header from "@/components/Header";
import SubHeader from "@/components/SubHeader";
import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import ContentFeeds from "@/components/ContentFeeds";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Header />
      <SubHeader />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <LeftSidebar />
          </div>
          
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            <Hero />
            <SearchSection />
            <ContentFeeds />
          </div>
          
          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-4">Fiscal Insights</h3>
              <p className="text-slate-300 text-sm">
                Sua plataforma completa de informações fiscais e tributárias.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Produtos</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Softwares</li>
                <li>Consultoria</li>
                <li>Ferramentas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Cursos</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>EAD</li>
                <li>Presencial</li>
                <li>In Company</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contato</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Fale Conosco</li>
                <li>Newsletter</li>
                <li>Suporte</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-6 pt-6 text-center text-sm text-slate-300">
            © 2024 Fiscal Insights Platform. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
