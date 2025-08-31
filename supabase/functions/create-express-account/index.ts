// Create an Express account (if not exists) and return an Account Link URL for onboarding.
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  try {
    const { user_id, account_type = 'express', refresh_url, return_url } = await req.json().catch(() => ({}))
    if (!user_id) return new Response(JSON.stringify({ error: 'missing user_id' }), { status: 400 })

  const STRIPE_SECRET = Deno.env.get('STRIPE_SECRET_KEY')
    if (!STRIPE_SECRET) return new Response('Stripe secret not configured', { status: 500 })

    // Create or retrieve a Stripe Account for this user. In a real app you'd check your DB for stored acct id.
    // For now we create an account every time (idempotency could be added)
    const acctRes = await fetch('https://api.stripe.com/v1/accounts', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${STRIPE_SECRET}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ type: account_type })
    })
    const acct = await acctRes.json()
    if (!acct || acct.error) return new Response(JSON.stringify(acct), { status: 500 })

    // Create an account link for onboarding
    const linkRes = await fetch('https://api.stripe.com/v1/account_links', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${STRIPE_SECRET}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        account: acct.id,
        refresh_url: refresh_url || 'https://your-app.example.com/onboard/refresh',
        return_url: return_url || 'https://your-app.example.com/onboard/return',
        type: 'account_onboarding'
      })
    })
    const link = await linkRes.json()

    // In production store acct.id in your users table linked to user_id.
    return new Response(JSON.stringify({ account: acct, link }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
