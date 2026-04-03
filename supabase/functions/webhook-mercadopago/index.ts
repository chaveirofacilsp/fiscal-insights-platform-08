import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-signature, x-request-id",
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

    // Mercado Pago sends different notification formats
    // IPN (Instant Payment Notification) or Webhooks
    const eventType = payload.type || payload.topic || "unknown";
    const externalId = payload.data?.id?.toString() || payload.id?.toString() || null;

    const xSignature = req.headers.get("x-signature");
    const xRequestId = req.headers.get("x-request-id");

    if (xSignature) {
      console.log("Mercado Pago signature received:", xRequestId);
    }

    // Store the notification
    const { error: insertError } = await supabase
      .from("payment_notifications")
      .insert({
        gateway: "mercadopago",
        event_type: eventType,
        external_id: externalId,
        payload,
        status: "received",
      });

    if (insertError) throw insertError;

    // Process based on event type
    let processed = false;
    switch (eventType) {
      case "payment":
      case "payment.created":
      case "payment.updated":
        console.log(`MercadoPago payment event: ${eventType} - ${externalId}`);
        // Fetch payment details from MP API if needed
        processed = true;
        break;
      case "plan":
      case "subscription_preapproval":
      case "subscription_preapproval_plan":
        console.log(`MercadoPago subscription event: ${eventType} - ${externalId}`);
        processed = true;
        break;
      case "subscription_authorized_payment":
        console.log(`MercadoPago subscription payment: ${externalId}`);
        processed = true;
        break;
      case "chargebacks":
        console.log(`MercadoPago chargeback: ${externalId}`);
        processed = true;
        break;
      case "merchant_order":
        console.log(`MercadoPago merchant order: ${externalId}`);
        processed = true;
        break;
      default:
        console.log(`MercadoPago unhandled event: ${eventType}`);
    }

    if (processed) {
      await supabase
        .from("payment_notifications")
        .update({ status: "processed", processed_at: new Date().toISOString() })
        .eq("external_id", externalId)
        .eq("gateway", "mercadopago");
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("MercadoPago webhook error:", error);
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
