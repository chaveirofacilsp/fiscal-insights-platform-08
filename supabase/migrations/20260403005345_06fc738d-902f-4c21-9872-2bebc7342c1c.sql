CREATE TABLE public.payment_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gateway TEXT NOT NULL,
  event_type TEXT NOT NULL,
  external_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'received',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.payment_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view payment notifications"
ON public.payment_notifications
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service can insert payment notifications"
ON public.payment_notifications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service can update payment notifications"
ON public.payment_notifications
FOR UPDATE
USING (true);

CREATE INDEX idx_payment_notifications_gateway ON public.payment_notifications(gateway);
CREATE INDEX idx_payment_notifications_external_id ON public.payment_notifications(external_id);
CREATE INDEX idx_payment_notifications_created_at ON public.payment_notifications(created_at DESC);