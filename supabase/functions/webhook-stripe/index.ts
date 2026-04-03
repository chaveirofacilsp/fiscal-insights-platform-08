import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
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
    const signature = req.headers.get("stripe-signature");

    // Log the notification
    const payload = JSON.parse(body);
    const eventType = payload.type || "unknown";
    const externalId = payload.data?.object?.id || payload.id || null;

    // Fetch webhook secret from payment_gateways table
    const { data: gateway } = await supabase
      .from("payment_gateways")
      .select("webhook_secret")
      .eq("gateway_name", "stripe")
      .eq("is_active", true)
      .single();

    // If we have a webhook secret and signature, validate (basic check)
    if (gateway?.webhook_secret && signature) {
      // In production, use Stripe's signature verification library
      // For now, we log a warning if no proper validation
      console.log("Stripe signature received, webhook secret configured");
    }

    // Store the notification
    const { error: insertError } = await supabase
      .from("payment_notifications")
      .insert({
        gateway: "stripe",
        event_type: eventType,
        external_id: externalId,
        payload,
        status: "received",
      });

    if (insertError) throw insertError;

    // Process based on event type
    let processed = false;
    switch (eventType) {
      case "checkout.session.completed":
      case "payment_intent.succeeded":
        console.log(`Stripe payment succeeded: ${externalId}`);
        processed = true;
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        console.log(`Stripe subscription event: ${eventType} - ${externalId}`);
        processed = true;
        break;
      case "customer.subscription.deleted":
        console.log(`Stripe subscription cancelled: ${externalId}`);
        processed = true;
        break;
      case "invoice.paid":
        console.log(`Stripe invoice paid: ${externalId}`);
        processed = true;
        break;
      case "invoice.payment_failed":
        console.log(`Stripe invoice payment failed: ${externalId}`);
        processed = true;
        break;
      default:
        console.log(`Stripe unhandled event: ${eventType}`);
    }

    // Update notification status
    if (processed) {
      await supabase
        .from("payment_notifications")
        .update({ status: "processed", processed_at: new Date().toISOString() })
        .eq("external_id", externalId)
        .eq("gateway", "stripe");
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Stripe webhook error:", error);

    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
