import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Minimal haversine
function toRad(v: number) { return v * Math.PI / 180 }
function haversineKm(lat1:number, lon1:number, lat2:number, lon2:number){
  const R=6371
  const dLat=toRad(lat2-lat1)
  const dLon=toRad(lon2-lon1)
  const a=Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

serve(async (req) => {
  try {
    const body = await req.json().catch(() => ({}))
    const { sender_id, receiver_id, amount_cents, lat, lng, purpose='send' } = body
    if (!sender_id || !receiver_id || !amount_cents) return new Response(JSON.stringify({ error: 'missing params' }), { status:400 })

    const STRIPE_SECRET = Deno.env.get('STRIPE_SECRET_KEY') || ''
    const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY') || ''
    const PROJECT_URL = Deno.env.get('PROJECT_URL') || ''
    if (!STRIPE_SECRET || !SERVICE_ROLE_KEY || !PROJECT_URL) return new Response('Server not configured', { status:500 })

    // Fetch receiver's geofence from Supabase (REST API)
    const res = await fetch(`${PROJECT_URL}/rest/v1/user_restrictions?user_id=eq.${receiver_id}`, {
      headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` }
    })
    const restrictions = await res.json()
    if (restrictions && restrictions.length>0 && lat!=null && lng!=null){
      const r = restrictions[0]
      const rlat = r.geo_lat ?? r.latitude
      const rlng = r.geo_lng ?? r.longitude
      const rRadiusMeters = r.geo_radius_meters ?? (r.radius_km ? (r.radius_km * 1000) : null)
      const rKm = rRadiusMeters ? (rRadiusMeters / 1000) : (r.radius_km || 0)
      const dist = haversineKm(rlat, rlng, lat, lng)
      if (rKm && dist > rKm) return new Response(JSON.stringify({ error: 'geo_restriction' }), { status:403 })
    }

    // Create PaymentIntent as destination charge to receiver account
    const userRes = await fetch(`${PROJECT_URL}/rest/v1/users?id=eq.${receiver_id}`, { headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` } })
    const users = await userRes.json()
    const receiverAcct = users && users[0] && users[0].stripe_account_id
    if (!receiverAcct) return new Response(JSON.stringify({ error: 'receiver_not_connected' }), { status:400 })

    // Build form body for Stripe
    const params = new URLSearchParams()
    params.append('amount', String(amount_cents))
    params.append('currency', 'usd')
    params.append('confirm', 'true')
    params.append('payment_method_types[]', 'card')
    params.append('transfer_data[destination]', receiverAcct)

    const piRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${STRIPE_SECRET}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    })
    const pi = await piRes.json()
    if (pi.error) return new Response(JSON.stringify(pi), { status:500 })

    // Store transaction in DB (map to transactions table columns)
    const txBody = {
      user_from: sender_id,
      user_to: receiver_id,
      amount_cents,
      currency: 'usd',
      stripe_payment_intent_id: pi.id,
      status: 'PENDING',
      metadata: { geo: { lat, lng }, created_by: sender_id, source: 'create-payment-intent' }
    }
    const createTx = await fetch(`${PROJECT_URL}/rest/v1/transactions`, {
      method: 'POST',
      headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify(txBody)
    })
    const created = await createTx.json().catch(() => null)

    return new Response(JSON.stringify({ client_secret: pi.client_secret, payment_intent_id: pi.id, transaction: created }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: String(err) }), { status:500 })
  }
})
