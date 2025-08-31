import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  try {
    const { user_id } = await req.json().catch(() => ({}))
    if (!user_id) return new Response(JSON.stringify({ error: 'missing user_id' }), { status:400 })
  const SUPABASE_KEY = Deno.env.get('SERVICE_ROLE_KEY')
  const supabaseUrl = Deno.env.get('PROJECT_URL')
    const userRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${user_id}`, { headers: { apikey: SUPABASE_KEY } })
    const users = await userRes.json()
    const user = users && users[0]
    return new Response(JSON.stringify({ stripe_account_id: user && user.stripe_account_id }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: String(err) }), { status:500 })
  }
})
