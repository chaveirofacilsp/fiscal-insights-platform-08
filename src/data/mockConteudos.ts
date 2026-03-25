import { supabase } from "@/integrations/supabase/client";
import { Conteudo, PrazoObrigacao } from "@/types/conteudo";

// Fallback mock data used when database is empty
const mockConteudos: Conteudo[] = [
  {
    id: "1",
    titulo: "Nova Portaria MTE nº 3.665/2024 - Atualização do eSocial",
    tipo: "legislacao",
    categoria: "Trabalhista",
    orgao_emissor: "Ministério do Trabalho",
    numero_norma: "Portaria MTE nº 3.665/2024",
    data_publicacao: "2026-03-20",
    resumo_executivo: "Alterações nas regras de envio de eventos do eSocial para empresas do Simples Nacional.",
    comentario_tecnico: "A portaria simplifica o envio de eventos periódicos para MEIs e empresas do Simples Nacional.",
    exemplo_pratico: "Empresa optante pelo Simples com 5 funcionários: antes enviava 12 eventos mensais, agora envia 8.",
    tags: ["eSocial", "Simples Nacional", "MEI"],
    nivel_acesso: "gratuito",
    destaque: true,
    visualizacoes: 1250,
    status: "publicado",
    created_at: "2026-03-20",
    updated_at: "2026-03-20",
  },
  {
    id: "2",
    titulo: "Reajuste do Salário Mínimo 2026 e Reflexos Trabalhistas",
    tipo: "artigo",
    categoria: "Trabalhista",
    orgao_emissor: "Governo Federal",
    numero_norma: "Decreto nº 12.150/2026",
    data_publicacao: "2026-03-15",
    resumo_executivo: "O salário mínimo de 2026 foi fixado em R$ 1.582,00. Veja os impactos em folha de pagamento, FGTS, INSS e benefícios.",
    comentario_tecnico: "O reajuste impacta diretamente pisos salariais estaduais, contribuições previdenciárias e teto do INSS.",
    tags: ["Salário Mínimo", "Folha de Pagamento", "INSS"],
    nivel_acesso: "gratuito",
    destaque: true,
    visualizacoes: 2100,
    status: "publicado",
    created_at: "2026-03-15",
    updated_at: "2026-03-15",
  },
  {
    id: "8",
    titulo: "Reforma Tributária: Regulamentação do IBS e CBS",
    tipo: "legislacao",
    categoria: "Fiscal",
    orgao_emissor: "Congresso Nacional",
    numero_norma: "LC 214/2025",
    data_publicacao: "2026-03-22",
    resumo_executivo: "Análise da regulamentação do IBS e CBS com cronograma de implementação.",
    comentario_tecnico: "A transição será gradual entre 2026 e 2033.",
    exemplo_pratico: "Comércio varejista: simulação de carga tributária comparando ICMS/PIS/COFINS atual vs. IBS/CBS.",
    tags: ["Reforma Tributária", "IBS", "CBS", "ICMS"],
    nivel_acesso: "gratuito",
    destaque: true,
    visualizacoes: 3200,
    status: "publicado",
    created_at: "2026-03-22",
    updated_at: "2026-03-22",
  },
];

const mockPrazos: PrazoObrigacao[] = [
  {
    id: "p1",
    titulo: "DCTF Mensal - Competência Fevereiro/2026",
    descricao: "Entrega da DCTF referente à competência de fevereiro de 2026.",
    data_vencimento: "2026-04-15",
    recorrencia: "Mensal",
    categoria: "Fiscal",
    orgao_responsavel: "Receita Federal",
    nivel_acesso: "gratuito",
    created_at: "2026-03-01",
  },
  {
    id: "p2",
    titulo: "GFIP/SEFIP - Competência Março/2026",
    descricao: "Entrega da Guia de Recolhimento do FGTS.",
    data_vencimento: "2026-04-07",
    recorrencia: "Mensal",
    categoria: "Trabalhista",
    orgao_responsavel: "Caixa Econômica Federal / INSS",
    nivel_acesso: "gratuito",
    created_at: "2026-03-01",
  },
  {
    id: "p3",
    titulo: "DAS - Simples Nacional Março/2026",
    descricao: "Pagamento do DAS referente a março/2026.",
    data_vencimento: "2026-04-20",
    recorrencia: "Mensal",
    categoria: "Fiscal",
    orgao_responsavel: "Receita Federal",
    nivel_acesso: "gratuito",
    created_at: "2026-03-01",
  },
  {
    id: "p4",
    titulo: "DIRPF 2026",
    descricao: "Prazo final para entrega da DIRPF 2026.",
    data_vencimento: "2026-05-31",
    recorrencia: "Anual",
    categoria: "Fiscal",
    orgao_responsavel: "Receita Federal",
    nivel_acesso: "gratuito",
    created_at: "2026-03-01",
  },
];

// Fetch conteudos from Supabase, fallback to mock
export async function fetchConteudos(): Promise<Conteudo[]> {
  try {
    const { data, error } = await supabase
      .from('conteudos')
      .select('*')
      .eq('status', 'publicado')
      .order('data_publicacao', { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(mapDbToConteudo);
    }
  } catch (e) {
    console.error('Error fetching conteudos:', e);
  }
  return mockConteudos;
}

export async function fetchConteudosByCategoria(categoria: string): Promise<Conteudo[]> {
  try {
    const { data, error } = await supabase
      .from('conteudos')
      .select('*')
      .eq('status', 'publicado')
      .eq('categoria', categoria)
      .order('data_publicacao', { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(mapDbToConteudo);
    }
  } catch (e) {
    console.error('Error fetching conteudos by categoria:', e);
  }
  return mockConteudos.filter(c => c.categoria === categoria);
}

export async function fetchConteudosDestaque(): Promise<Conteudo[]> {
  try {
    const { data, error } = await supabase
      .from('conteudos')
      .select('*')
      .eq('status', 'publicado')
      .eq('destaque', true)
      .order('data_publicacao', { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(mapDbToConteudo);
    }
  } catch (e) {
    console.error('Error fetching destaques:', e);
  }
  return mockConteudos.filter(c => c.destaque);
}

export async function fetchPrazos(): Promise<PrazoObrigacao[]> {
  try {
    const { data, error } = await supabase
      .from('prazos_obrigacoes')
      .select('*')
      .gte('data_vencimento', new Date().toISOString().split('T')[0])
      .order('data_vencimento', { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(mapDbToPrazo);
    }
  } catch (e) {
    console.error('Error fetching prazos:', e);
  }
  return mockPrazos.filter(p => new Date(p.data_vencimento) >= new Date())
    .sort((a, b) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime());
}

export async function triggerContentUpdate(): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('update-content');
    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Error triggering content update:', e);
    return { success: false, error: String(e) };
  }
}

// Legacy sync functions for backward compatibility
export const getConteudosByCategoria = (categoria: string) =>
  mockConteudos.filter((c) => c.categoria === categoria);

export const getConteudosDestaque = () =>
  mockConteudos.filter((c) => c.destaque);

export const getPrazosProximos = () =>
  mockPrazos
    .filter((p) => new Date(p.data_vencimento) >= new Date())
    .sort((a, b) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime());

// Helpers
function mapDbToConteudo(row: Record<string, unknown>): Conteudo {
  return {
    id: row.id as string,
    titulo: row.titulo as string,
    tipo: (row.tipo as string) as Conteudo['tipo'],
    categoria: (row.categoria as string) as Conteudo['categoria'],
    orgao_emissor: row.orgao_emissor as string | undefined,
    numero_norma: row.numero_norma as string | undefined,
    data_publicacao: row.data_publicacao as string,
    texto_oficial: row.texto_oficial as string | undefined,
    resumo_executivo: row.resumo_executivo as string | undefined,
    comentario_tecnico: row.comentario_tecnico as string | undefined,
    exemplo_pratico: row.exemplo_pratico as string | undefined,
    modelo_documento: row.modelo_documento as string | undefined,
    dicas_alertas: row.dicas_alertas as string | undefined,
    tags: (row.tags as string[]) || [],
    nivel_acesso: (row.nivel_acesso as string) as Conteudo['nivel_acesso'],
    destaque: row.destaque as boolean,
    visualizacoes: row.visualizacoes as number,
    autor_id: row.autor_id as string | undefined,
    status: (row.status as string) as Conteudo['status'],
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function mapDbToPrazo(row: Record<string, unknown>): PrazoObrigacao {
  return {
    id: row.id as string,
    titulo: row.titulo as string,
    descricao: row.descricao as string | undefined,
    data_vencimento: row.data_vencimento as string,
    recorrencia: row.recorrencia as string | undefined,
    categoria: (row.categoria as string) as PrazoObrigacao['categoria'],
    orgao_responsavel: row.orgao_responsavel as string | undefined,
    nivel_acesso: (row.nivel_acesso as string) as PrazoObrigacao['nivel_acesso'],
    created_at: row.created_at as string,
  };
}
