
-- Create subscriptions table
CREATE TABLE public.assinaturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plano_id UUID REFERENCES public.planos_assinatura(id),
  gateway TEXT,
  external_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  valor_pago NUMERIC,
  data_inicio TIMESTAMP WITH TIME ZONE,
  data_fim TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
ON public.assinaturas FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
ON public.assinaturas FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
ON public.assinaturas FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update subscriptions"
ON public.assinaturas FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service can update subscriptions"
ON public.assinaturas FOR UPDATE
USING (true);

-- Insert initial plans
INSERT INTO public.planos_assinatura (nome, descricao, preco, tipo, recursos, ativo) VALUES
('Gratuito', 'Para conhecer a plataforma', 0, 'fixo', '["Acesso a notícias e resumos básicos","5 artigos completos por mês","Ferramentas limitadas"]'::jsonb, true),
('Premium Individual', 'Para profissionais que buscam excelência', 49.90, 'fixo', '["Acesso ilimitado a todo conteúdo","Comentários técnicos completos","Todas as ferramentas","Boletins semanais exclusivos","Alertas personalizados","Certificados de atualização","Suporte por e-mail"]'::jsonb, true),
('Premium Corporativo', 'Para escritórios e empresas', 199.90, 'fixo', '["Tudo do Premium Individual","Até 10 usuários","Autoavaliações de conformidade","Consultoria mensal (1h)","Suporte prioritário","Dashboard gerencial","Acesso API (em breve)","Treinamento in company"]'::jsonb, true);
