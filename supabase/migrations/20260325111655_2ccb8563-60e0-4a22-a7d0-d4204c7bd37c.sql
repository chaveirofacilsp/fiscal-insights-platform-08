
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  documento TEXT,
  email TEXT,
  empresa TEXT,
  habilitado BOOLEAN DEFAULT true,
  nome_completo TEXT,
  plano TEXT DEFAULT 'gratuito',
  status TEXT DEFAULT 'pendente',
  telefone TEXT,
  tipo_pessoa TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create conteudos table
CREATE TABLE public.conteudos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'artigo',
  categoria TEXT NOT NULL,
  orgao_emissor TEXT,
  numero_norma TEXT,
  data_publicacao DATE NOT NULL DEFAULT now(),
  texto_oficial TEXT,
  resumo_executivo TEXT,
  comentario_tecnico TEXT,
  exemplo_pratico TEXT,
  modelo_documento TEXT,
  dicas_alertas TEXT,
  tags TEXT[] DEFAULT '{}',
  nivel_acesso TEXT NOT NULL DEFAULT 'gratuito',
  destaque BOOLEAN DEFAULT false,
  visualizacoes INTEGER DEFAULT 0,
  autor_id UUID,
  status TEXT NOT NULL DEFAULT 'publicado',
  fonte_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.conteudos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published conteudos" ON public.conteudos FOR SELECT USING (status = 'publicado');
CREATE POLICY "Service can insert conteudos" ON public.conteudos FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can update conteudos" ON public.conteudos FOR UPDATE USING (true);
CREATE POLICY "Service can delete conteudos" ON public.conteudos FOR DELETE USING (true);

-- Create prazos_obrigacoes table
CREATE TABLE public.prazos_obrigacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_vencimento DATE NOT NULL,
  recorrencia TEXT,
  categoria TEXT NOT NULL,
  orgao_responsavel TEXT,
  nivel_acesso TEXT NOT NULL DEFAULT 'gratuito',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.prazos_obrigacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read prazos" ON public.prazos_obrigacoes FOR SELECT USING (true);
CREATE POLICY "Service can insert prazos" ON public.prazos_obrigacoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can update prazos" ON public.prazos_obrigacoes FOR UPDATE USING (true);
CREATE POLICY "Service can delete prazos" ON public.prazos_obrigacoes FOR DELETE USING (true);

-- Create matriculas table
CREATE TABLE public.matriculas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  dados_matricula JSONB,
  nome_curso TEXT NOT NULL,
  status TEXT DEFAULT 'pendente',
  tipo_curso TEXT NOT NULL,
  user_id UUID,
  valor NUMERIC
);

ALTER TABLE public.matriculas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own matriculas" ON public.matriculas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert matriculas" ON public.matriculas FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create planos_assinatura table
CREATE TABLE public.planos_assinatura (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  descricao TEXT,
  nome TEXT NOT NULL,
  preco NUMERIC,
  recursos JSONB,
  tipo TEXT NOT NULL
);

ALTER TABLE public.planos_assinatura ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read planos" ON public.planos_assinatura FOR SELECT USING (true);

-- Create solicitacoes_orcamento table
CREATE TABLE public.solicitacoes_orcamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  descricao_necessidade TEXT NOT NULL,
  email TEXT NOT NULL,
  empresa TEXT,
  nome TEXT NOT NULL,
  status TEXT DEFAULT 'pendente',
  telefone TEXT,
  user_id UUID
);

ALTER TABLE public.solicitacoes_orcamento ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own solicitacoes" ON public.solicitacoes_orcamento FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert solicitacoes" ON public.solicitacoes_orcamento FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all solicitacoes" ON public.solicitacoes_orcamento FOR SELECT USING (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_conteudos_updated_at BEFORE UPDATE ON public.conteudos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create planilhas_mensais table
CREATE TABLE public.planilhas_mensais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ano INTEGER NOT NULL,
  arquivo_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  descricao TEXT,
  mes INTEGER NOT NULL
);

ALTER TABLE public.planilhas_mensais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read planilhas" ON public.planilhas_mensais FOR SELECT USING (true);
