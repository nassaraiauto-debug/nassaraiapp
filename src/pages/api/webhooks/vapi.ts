import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const sig = req.headers['x-signature']
  if (sig !== process.env.VAPI_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Invalid signature' })
  }
  const event = req.body
  if (!event.call_external_id) return res.status(400).json({ error: 'Missing call ID' })

  if (event.type === 'call.started') {
    await supabase.from('calls').insert({
      agent_id: '00000000-0000-0000-0000-000000000001',
      call_external_id: event.call_external_id,
      direction: event.direction,
      started_at: event.timestamp,
      status: event.status,
    })
  }

  if (event.type === 'call.ended') {
    await supabase.from('calls').update({
      ended_at: event.timestamp,
      duration_sec: event.usage?.carrier_sec || null,
      status: event.status,
      outcome: event.outcome || null,
      usage: event.usage || {},
      total_cost_cents: 100
    }).eq('call_external_id', event.call_external_id)
  }
  return res.status(200).json({ success: true })
}
