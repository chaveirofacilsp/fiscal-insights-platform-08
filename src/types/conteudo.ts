export type TipoConteudo = 'legislacao' | 'noticia' | 'artigo' | 'comentario';

export type CategoriaConteudo = 
  | 'Trabalhista' 
  | 'Previdenciaria' 
  | 'Contabil' 
  | 'Fiscal' 
  | 'ICMS' 
  | 'ISS' 
  | 'IPI' 
  | 'PIS' 
  | 'COFINS' 
  | 'IR' 
  | 'INSS' 
  | 'FGTS' 
  | 'eSocial' 
  | 'SPED' 
  | 'Simples Nacional';

export type NivelAcesso = 'gratuito' | 'premium' | 'corporativo';

export type StatusConteudo = 'rascunho' | 'publicado' | 'arquivado';

export type AppRole = 'admin' | 'editor' | 'assinante_premium' | 'assinante_corporativo' | 'gratuito';

export interface Conteudo {
  id: string;
  titulo: string;
  tipo: TipoConteudo;
  categoria: CategoriaConteudo;
  orgao_emissor?: string;
  numero_norma?: string;
  data_publicacao: string;
  texto_oficial?: string;
  resumo_executivo?: string;
  comentario_tecnico?: string;
  exemplo_pratico?: string;
  modelo_documento?: string;
  dicas_alertas?: string;
  tags: string[];
  nivel_acesso: NivelAcesso;
  destaque: boolean;
  visualizacoes: number;
  autor_id?: string;
  status: StatusConteudo;
  created_at: string;
  updated_at: string;
}

export interface PrazoObrigacao {
  id: string;
  titulo: string;
  descricao?: string;
  data_vencimento: string;
  recorrencia?: string;
  categoria: CategoriaConteudo;
  orgao_responsavel?: string;
  nivel_acesso: NivelAcesso;
  created_at: string;
}

export interface Favorito {
  id: string;
  user_id: string;
  conteudo_id: string;
  created_at: string;
}

export interface HistoricoLeitura {
  id: string;
  user_id: string;
  conteudo_id: string;
  tempo_leitura?: number;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}
