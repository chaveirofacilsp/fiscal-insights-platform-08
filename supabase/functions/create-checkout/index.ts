import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { plano_id } = await req.json();
    if (!plano_id) {
      return new Response(JSON.stringify({ error: 'plano_id é obrigatório' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get plan details
    const { data: plano, error: planoError } = await supabaseAdmin
      .from('planos_assinatura')
      .select('*')
      .eq('id', plano_id)
      .single();

    if (planoError || !plano) {
      return new Response(JSON.stringify({ error: 'Plano não encontrado' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Free plan - just create subscription directly
    if (plano.preco === 0 || plano.preco === null) {
      const { data: assinatura, error: assError } = await supabaseAdmin
        .from('assinaturas')
        .insert({
          user_id: user.id,
          plano_id: plano.id,
          status: 'ativa',
          valor_pago: 0,
          data_inicio: new Date().toISOString(),
        })
        .select()
        .single();

      if (assError) throw assError;

      // Update profile plan
      await supabaseAdmin
        .from('profiles')
        .update({ plano: 'gratuito', status: 'ativo', habilitado: true })
        .eq('id', user.id);

      return new Response(JSON.stringify({ 
        success: true, 
        type: 'free',
        message: 'Plano gratuito ativado com sucesso!' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get active payment gateway
    const { data: gateway, error: gwError } = await supabaseAdmin
      .from('payment_gateways')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (gwError || !gateway) {
      // No gateway active - create pending subscription
      const { data: assinatura } = await supabaseAdmin
        .from('assinaturas')
        .insert({
          user_id: user.id,
          plano_id: plano.id,
          status: 'pendente',
          valor_pago: plano.preco,
        })
        .select()
        .single();

      return new Response(JSON.stringify({
        success: true,
        type: 'pending',
        message: 'Solicitação de assinatura registrada. Entraremos em contato para finalizar o pagamento.',
        assinatura_id: assinatura?.id
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create pending subscription
    const { data: assinatura } = await supabaseAdmin
      .from('assinaturas')
      .insert({
        user_id: user.id,
        plano_id: plano.id,
        gateway: gateway.gateway_name,
        status: 'aguardando_pagamento',
        valor_pago: plano.preco,
      })
      .select()
      .single();

    // Generate checkout URL based on gateway
    let checkoutUrl = '';
    const returnUrl = req.headers.get('origin') || 'https://fiscal-insights-platform-08.lovable.app';

    switch (gateway.gateway_name) {
      case 'stripe':
        // Stripe Checkout Session would be created here with the Stripe API
        // For now, return info for client-side redirect
        checkoutUrl = `https://checkout.stripe.com/pay?amount=${Math.round(plano.preco * 100)}&currency=brl`;
        break;
      case 'mercadopago':
        checkoutUrl = `https://www.mercadopago.com.br/checkout/v1/redirect`;
        break;
      case 'pagseguro':
        checkoutUrl = `https://pagseguro.uol.com.br/v2/checkout`;
        break;
      case 'asaas':
        checkoutUrl = `https://www.asaas.com/c/checkout`;
        break;
    }

    return new Response(JSON.stringify({
      success: true,
      type: 'checkout',
      gateway: gateway.gateway_name,
      checkout_url: checkoutUrl,
      assinatura_id: assinatura?.id,
      message: `Redirecionando para pagamento via ${gateway.display_name}...`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
