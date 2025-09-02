import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // Debug: log incoming request and Stripe key
  try {
    const STRIPE_SECRET = Deno.env.get("STRIPE_SECRET_KEY");
    console.log("Loaded STRIPE_SECRET_KEY:", STRIPE_SECRET ? STRIPE_SECRET.slice(0,8) + "..." : "undefined");
  } catch (e) {
    console.error("Error loading STRIPE_SECRET_KEY:", e);
  }
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const {
      user_id,
      account_type = "express",
      refresh_url,
      return_url,
      email,
    } = await req.json().catch(() => ({}));

    if (!user_id) {
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const STRIPE_SECRET = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET) {
      return new Response("Stripe secret not configured", {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Create Stripe account (in production, check DB for existing account ID)
    const acctRes = await fetch("https://api.stripe.com/v1/accounts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        type: account_type,
        ...(email ? { email } : {}),
      }),
    });

    const acct = await acctRes.json();
    if (!acct || acct.error) {
      console.error("Stripe account creation error:", acct.error);
      return new Response(JSON.stringify(acct), {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Create onboarding link
    const linkRes = await fetch("https://api.stripe.com/v1/account_links", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        account: acct.id,
        refresh_url:
          refresh_url || "https://your-app.com/onboard/refresh",
        return_url:
          return_url || "https://your-app.com/onboard/return",
        type: "account_onboarding",
      }),
    });

    const link = await linkRes.json();
    if (!link || link.error) {
      console.error("Stripe account link error:", link?.error);
      return new Response(JSON.stringify({ error: link?.error || 'No onboarding link returned' }), {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response(
      JSON.stringify({
        account: acct,
        link_url: link?.url || null,
        link,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error("Unhandled error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});