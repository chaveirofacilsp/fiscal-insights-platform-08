import { Receipt } from "lucide-react";
import LegislacaoPage from "@/components/LegislacaoPage";

const Fiscal = () => (
  <LegislacaoPage
    categoria="Fiscal"
    titulo="Legislação Fiscal"
    descricao="Tributos federais, estaduais e municipais, reforma tributária e obrigações acessórias com análise e exemplos."
    icone={<Receipt className="h-8 w-8 text-primary" />}
  />
);

export default Fiscal;
