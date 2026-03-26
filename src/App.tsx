import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { IndicesProvider } from "@/contexts/IndicesContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminPanel from "./components/AdminPanel";
import AuthPage from "./components/auth/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import QuemSomos from "./pages/QuemSomos";
import Softwares from "./pages/Softwares";
import Consultoria from "./pages/Consultoria";
import Ferramentas from "./pages/Ferramentas";
import Cursos from "./pages/Cursos";
import EAD from "./pages/EAD";
import Presencial from "./pages/Presencial";
import InCompany from "./pages/InCompany";
import Contato from "./pages/Contato";
import Newsletter from "./pages/Newsletter";
import Suporte from "./pages/Suporte";
import Desenquadramento from "./pages/Desenquadramento";
import Optantes from "./pages/Optantes";
import Sublimites from "./pages/Sublimites";
import Anexos from "./pages/Anexos";
import Calculo from "./pages/Calculo";
import IR from "./pages/IR";
import PisCofins from "./pages/PisCofins";
import IcmsIssIpi from "./pages/IcmsIssIpi";
import TrabalhoPrevidencia from "./pages/TrabalhoPrevidencia";
import Comercial from "./pages/Comercial";
import Sped from "./pages/Sped";
import Declaracoes from "./pages/Declaracoes";
import Contabilidade from "./pages/Contabilidade";
import ReformaPrevidencia from "./pages/ReformaPrevidencia";
import BuscaAvancada from "./pages/BuscaAvancada";
import FerramentasUteis from "./pages/FerramentasUteis";
import Publicacoes from "./pages/Publicacoes";
import Planos from "./pages/Planos";
import Comunidade from "./pages/Comunidade";
import CalendarioFiscal from "./pages/CalendarioFiscal";
// Legislação
import Trabalhista from "./pages/legislacao/Trabalhista";
import Previdenciaria from "./pages/legislacao/Previdenciaria";
import Contabil from "./pages/legislacao/Contabil";
import Fiscal from "./pages/legislacao/Fiscal";
// Subcategories
import PessoaFisica from "./pages/ir/PessoaFisica";
import PessoaJuridica from "./pages/ir/PessoaJuridica";
import Cumulativo from "./pages/pis-cofins/Cumulativo";
import ESocial from "./pages/trabalho-previdencia/ESocial";
import IcmsEstadual from "./pages/icms-iss-ipi/IcmsEstadual";
import IssMunicipal from "./pages/icms-iss-ipi/IssMunicipal";
import IpiFederal from "./pages/icms-iss-ipi/IpiFederal";
import SubstituicaoTributaria from "./pages/icms-iss-ipi/SubstituicaoTributaria";
import BeneficiosICMS from "./pages/icms-iss-ipi/Beneficios";
import Fgts from "./pages/trabalho-previdencia/Fgts";
import Contribuicoes from "./pages/trabalho-previdencia/Contribuicoes";
import FolhaPagamento from "./pages/trabalho-previdencia/FolhaPagamento";
import BeneficiosTP from "./pages/trabalho-previdencia/Beneficios";
import NotasFiscais from "./pages/comercial/NotasFiscais";
import Contratos from "./pages/comercial/Contratos";
import Documentos from "./pages/comercial/Documentos";
import ImportacaoExportacao from "./pages/comercial/ImportacaoExportacao";
import Ecd from "./pages/sped/Ecd";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <IndicesProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } />
                
                {/* Legislação */}
                <Route path="/legislacao/trabalhista" element={<Trabalhista />} />
                <Route path="/legislacao/previdenciaria" element={<Previdenciaria />} />
                <Route path="/legislacao/contabil" element={<Contabil />} />
                <Route path="/legislacao/fiscal" element={<Fiscal />} />
                
                {/* Principais */}
                <Route path="/calendario-fiscal" element={<CalendarioFiscal />} />
                <Route path="/planos" element={<Planos />} />
                <Route path="/comunidade" element={<Comunidade />} />
                <Route path="/quem-somos" element={<QuemSomos />} />
                <Route path="/softwares" element={<Softwares />} />
                <Route path="/consultoria" element={<Consultoria />} />
                <Route path="/ferramentas" element={<Ferramentas />} />
                <Route path="/ferramentas-uteis" element={<FerramentasUteis />} />
                <Route path="/busca-avancada" element={<BuscaAvancada />} />
                <Route path="/publicacoes" element={<Publicacoes />} />
                <Route path="/cursos" element={<Cursos />} />
                <Route path="/cursos/ead" element={<EAD />} />
                <Route path="/cursos/presencial" element={<Presencial />} />
                <Route path="/cursos/incompany" element={<InCompany />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/newsletter" element={<Newsletter />} />
                <Route path="/suporte" element={<Suporte />} />
                
                {/* Simples Nacional */}
                <Route path="/desenquadramento" element={<Desenquadramento />} />
                <Route path="/optantes" element={<Optantes />} />
                <Route path="/sublimites" element={<Sublimites />} />
                <Route path="/anexos" element={<Anexos />} />
                <Route path="/calculo" element={<Calculo />} />
                
                {/* Categorias */}
                <Route path="/ir" element={<IR />} />
                <Route path="/pis-cofins" element={<PisCofins />} />
                <Route path="/icms-iss-ipi" element={<IcmsIssIpi />} />
                <Route path="/trabalho-previdencia" element={<TrabalhoPrevidencia />} />
                <Route path="/comercial" element={<Comercial />} />
                <Route path="/sped" element={<Sped />} />
                <Route path="/declaracoes" element={<Declaracoes />} />
                <Route path="/contabilidade" element={<Contabilidade />} />
                <Route path="/reforma-previdencia" element={<ReformaPrevidencia />} />
                
                {/* Subcategorias */}
                <Route path="/ir/pessoa-fisica" element={<PessoaFisica />} />
                <Route path="/ir/pessoa-juridica" element={<PessoaJuridica />} />
                <Route path="/pis-cofins/cumulativo" element={<Cumulativo />} />
                <Route path="/icms-iss-ipi/icms-estadual" element={<IcmsEstadual />} />
                <Route path="/icms-iss-ipi/iss-municipal" element={<IssMunicipal />} />
                <Route path="/icms-iss-ipi/ipi-federal" element={<IpiFederal />} />
                <Route path="/icms-iss-ipi/substituicao-tributaria" element={<SubstituicaoTributaria />} />
                <Route path="/icms-iss-ipi/beneficios" element={<BeneficiosICMS />} />
                <Route path="/trabalho-previdencia/esocial" element={<ESocial />} />
                <Route path="/trabalho-previdencia/fgts" element={<Fgts />} />
                <Route path="/trabalho-previdencia/contribuicoes" element={<Contribuicoes />} />
                <Route path="/trabalho-previdencia/folha-pagamento" element={<FolhaPagamento />} />
                <Route path="/trabalho-previdencia/beneficios" element={<BeneficiosTP />} />
                <Route path="/comercial/notas-fiscais" element={<NotasFiscais />} />
                <Route path="/comercial/contratos" element={<Contratos />} />
                <Route path="/comercial/documentos" element={<Documentos />} />
                <Route path="/comercial/importacao-exportacao" element={<ImportacaoExportacao />} />
                <Route path="/sped/ecd" element={<Ecd />} />
                
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </IndicesProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
