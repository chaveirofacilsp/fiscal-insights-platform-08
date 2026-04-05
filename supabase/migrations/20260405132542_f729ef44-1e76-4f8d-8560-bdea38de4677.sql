
CREATE TABLE public.paginas_conteudo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pagina TEXT NOT NULL,
  secao TEXT NOT NULL,
  titulo TEXT,
  subtitulo TEXT,
  conteudo TEXT,
  imagem_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_paginas_conteudo_pagina_secao ON public.paginas_conteudo(pagina, secao);

ALTER TABLE public.paginas_conteudo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read page content"
ON public.paginas_conteudo FOR SELECT
USING (true);

CREATE POLICY "Admins can manage page content"
ON public.paginas_conteudo FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default content for main pages
INSERT INTO public.paginas_conteudo (pagina, secao, titulo, subtitulo, conteudo, ordem) VALUES
-- HOME
('home', 'hero', 'Portal de Legislação Fiscal e Trabalhista', 'Sua fonte confiável de informação tributária', 'Acesse legislação atualizada, ferramentas práticas e conteúdo interpretado por especialistas para manter sua empresa em conformidade.', 1),
('home', 'busca', 'Busca Avançada', 'Encontre rapidamente a legislação que você precisa', NULL, 2),
('home', 'feeds', 'Últimas Atualizações', 'Conteúdo mais recente publicado por nossos especialistas', NULL, 3),

-- QUEM SOMOS
('quem-somos', 'hero', 'Quem Somos', 'Conheça nossa história e missão', 'Somos uma equipe de especialistas dedicados a simplificar a complexidade da legislação fiscal e trabalhista brasileira, oferecendo conteúdo interpretado, ferramentas práticas e suporte personalizado.', 1),
('quem-somos', 'missao', 'Nossa Missão', NULL, 'Democratizar o acesso à informação tributária de qualidade, ajudando profissionais e empresas a manterem-se em conformidade com a legislação vigente.', 2),
('quem-somos', 'valores', 'Nossos Valores', NULL, 'Precisão, atualização constante, acessibilidade e compromisso com a excelência no conteúdo técnico.', 3),

-- CONTATO
('contato', 'hero', 'Fale Conosco', 'Estamos aqui para ajudar', 'Entre em contato com nossa equipe para tirar dúvidas, solicitar orçamentos ou obter suporte técnico.', 1),
('contato', 'info', 'Informações de Contato', NULL, 'Email: contato@newconecta.com.br | Telefone: (11) 99999-9999 | Horário: Seg-Sex, 9h às 18h', 2),

-- CURSOS
('cursos', 'hero', 'Cursos e Capacitação', 'Aprenda com especialistas', 'Oferecemos cursos presenciais, EAD e in company para profissionais que buscam atualização e excelência na área fiscal e trabalhista.', 1),

-- FERRAMENTAS
('ferramentas', 'hero', 'Ferramentas Úteis', 'Simplifique seu trabalho', 'Calculadoras, simuladores e ferramentas práticas para facilitar o dia a dia do profissional contábil e fiscal.', 1),

-- PLANOS
('planos', 'hero', 'Escolha o plano ideal para você', NULL, 'Acesse conteúdo interpretado, ferramentas práticas e mantenha-se sempre atualizado com a legislação fiscal e trabalhista', 1),

-- SUPORTE
('suporte', 'hero', 'Central de Suporte', 'Como podemos ajudar?', 'Acesse nossos canais de atendimento, base de conhecimento e recursos de autoatendimento.', 1),

-- NEWSLETTER
('newsletter', 'hero', 'Newsletter', 'Receba atualizações no seu email', 'Cadastre-se para receber nosso boletim semanal com as principais novidades da legislação fiscal e trabalhista.', 1),

-- CONSULTORIA
('consultoria', 'hero', 'Consultoria Especializada', 'Soluções sob medida para sua empresa', 'Nossa equipe de consultores especializados oferece orientação personalizada para questões complexas de legislação fiscal e trabalhista.', 1),

-- SOFTWARES
('softwares', 'hero', 'Softwares e Ferramentas', 'Tecnologia para sua empresa', 'Conheça nossas soluções de software para gestão fiscal, contábil e trabalhista.', 1),

-- PUBLICACOES
('publicacoes', 'hero', 'Publicações', 'Acervo técnico especializado', 'Acesse manuais, guias práticos, tabelas e conteúdo técnico produzido por nossos especialistas.', 1),

-- CALENDARIO FISCAL
('calendario-fiscal', 'hero', 'Calendário Fiscal de Obrigações', 'Nunca perca um prazo', 'Acompanhe todos os prazos de obrigações fiscais, trabalhistas e previdenciárias em um só lugar.', 1);
