import { Shield } from "lucide-react";
import LegislacaoPage from "@/components/LegislacaoPage";

const Previdenciaria = () => (
  <LegislacaoPage
    categoria="Previdenciaria"
    titulo="Legislação Previdenciária"
    descricao="INSS, contribuições, aposentadorias e benefícios previdenciários com interpretação e orientações práticas."
    icone={<Shield className="h-8 w-8 text-primary" />}
  />
);

export default Previdenciaria;
