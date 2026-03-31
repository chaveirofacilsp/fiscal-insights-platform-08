
-- Admin can update any profile (for habilitar/desabilitar, change plano/status)
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin full access to planos_assinatura
CREATE POLICY "Admins can manage planos"
ON public.planos_assinatura
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin can update solicitacoes_orcamento
CREATE POLICY "Admins can update solicitacoes"
ON public.solicitacoes_orcamento
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin can view all matriculas
CREATE POLICY "Admins can view all matriculas"
ON public.matriculas
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can update matriculas
CREATE POLICY "Admins can update matriculas"
ON public.matriculas
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin full access to planilhas_mensais
CREATE POLICY "Admins can manage planilhas"
ON public.planilhas_mensais
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
