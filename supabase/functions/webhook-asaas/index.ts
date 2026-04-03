import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, asaas-access-token",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const body = await req.text();
    const payload = JSON.parse(body);

    // Asaas webhook format
    const eventType = payload.event || "unknown";
    const externalId = payload.payment?.id || payload.subscription?.id || payload.id || null;

    // Validate access token if configured
    const accessToken = req.headers.get("asaas-access-token");
    if (accessToken) {
      const { data: gateway } = await supabase
        .from("payment_gateways")
        .select("webhook_secret")
        .eq("gateway_name", "asaas")
        .eq("is_active", true)
        .single();

      if (gateway?.webhook_secret && accessToken !== gateway.webhook_secret) {
        console.error("Asaas webhook: invalid access token");
        return new Response(JSON.stringify({ error: "Invalid token" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }
    }

    // Store the notification
    const { error: insertError } = await supabase
      .from("payment_notifications")
      .insert({
        gateway: "asaas",
        event_type: eventType,
        external_id: externalId,
        payload,
        status: "received",
      });

    if (insertError) throw insertError;

    // Process based on event type
    let processed = false;
    switch (eventType) {
      case "PAYMENT_CONFIRMED":
      case "PAYMENT_RECEIVED":
        console.log(`Asaas payment confirmed: ${externalId}`);
        processed = true;
        break;
      case "PAYMENT_OVERDUE":
        console.log(`Asaas payment overdue: ${externalId}`);
        processed = true;
        break;
      case "PAYMENT_REFUNDED":
        console.log(`Asaas payment refunded: ${externalId}`);
        processed = true;
        break;
      case "PAYMENT_DELETED":
      case "PAYMENT_RESTORED":
      case "PAYMENT_UPDATED":
        console.log(`Asaas payment event: ${eventType} - ${externalId}`);
        processed = true;
        break;
      case "SUBSCRIPTION_CREATED":
      case "SUBSCRIPTION_UPDATED":
      case "SUBSCRIPTION_DELETED":
      case "SUBSCRIPTION_RENEWED":
        console.log(`Asaas subscription event: ${eventType} - ${externalId}`);
        processed = true;
        break;
      case "TRANSFER_CREATED":
      case "TRANSFER_CONFIRMED":
        console.log(`Asaas transfer event: ${eventType} - ${externalId}`);
        processed = true;
        break;
      default:
        console.log(`Asaas unhandled event: ${eventType}`);
    }

    if (processed) {
      await supabase
        .from("payment_notifications")
        .update({ status: "processed", processed_at: new Date().toISOString() })
        .eq("external_id", externalId)
        .eq("gateway", "asaas");
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Asaas webhook error:", error);
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
