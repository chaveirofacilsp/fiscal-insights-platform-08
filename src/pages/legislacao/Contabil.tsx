import { BookOpen } from "lucide-react";
import LegislacaoPage from "@/components/LegislacaoPage";

const Contabil = () => (
  <LegislacaoPage
    categoria="Contabil"
    titulo="Legislação Contábil"
    descricao="Normas contábeis, NBC, CPC, escrituração digital e orientações para a prática contábil."
    icone={<BookOpen className="h-8 w-8 text-primary" />}
  />
);

export default Contabil;
