import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    let payload: Record<string, unknown>;
    let eventType = "unknown";
    let externalId: string | null = null;

    // PagSeguro can send JSON or form-encoded notifications
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      payload = JSON.parse(body);
      // PagSeguro V4 API format
      eventType = (payload.type as string) || "unknown";
      const charges = payload.charges as Array<{ id: string }> | undefined;
      externalId = (payload.id as string) || charges?.[0]?.id || null;
    } else {
      // Legacy PagSeguro notification (form-encoded)
      const params = new URLSearchParams(body);
      eventType = params.get("notificationType") || "transaction";
      externalId = params.get("notificationCode") || null;
      payload = Object.fromEntries(params.entries());
    }

    // Store the notification
    const { error: insertError } = await supabase
      .from("payment_notifications")
      .insert({
        gateway: "pagseguro",
        event_type: eventType,
        external_id: externalId,
        payload,
        status: "received",
      });

    if (insertError) throw insertError;

    // Process based on event type
    let processed = false;
    switch (eventType) {
      case "transaction":
      case "CHECKOUT.PAID":
      case "CHECKOUT.OVERDUE":
        console.log(`PagSeguro transaction event: ${eventType} - ${externalId}`);
        processed = true;
        break;
      case "pre_approval":
      case "SUBSCRIPTION.ACTIVATED":
      case "SUBSCRIPTION.CANCELLED":
      case "SUBSCRIPTION.SUSPENDED":
        console.log(`PagSeguro subscription event: ${eventType} - ${externalId}`);
        processed = true;
        break;
      case "CHARGE.PAID":
      case "CHARGE.REFUNDED":
      case "CHARGE.CANCELLED":
        console.log(`PagSeguro charge event: ${eventType} - ${externalId}`);
        processed = true;
        break;
      default:
        console.log(`PagSeguro unhandled event: ${eventType}`);
    }

    if (processed) {
      await supabase
        .from("payment_notifications")
        .update({ status: "processed", processed_at: new Date().toISOString() })
        .eq("external_id", externalId)
        .eq("gateway", "pagseguro");
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("PagSeguro webhook error:", error);
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
