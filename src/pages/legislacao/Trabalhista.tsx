import { Briefcase } from "lucide-react";
import LegislacaoPage from "@/components/LegislacaoPage";

const Trabalhista = () => (
  <LegislacaoPage
    categoria="Trabalhista"
    titulo="Legislação Trabalhista"
    descricao="CLT, folha de pagamento, benefícios e normas trabalhistas com comentários práticos e aplicáveis."
    icone={<Briefcase className="h-8 w-8 text-primary" />}
  />
);

export default Trabalhista;
