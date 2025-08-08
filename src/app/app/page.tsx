'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { format } from 'date-fns'
export default function Dashboard() {
  const [calls, setCalls] = useState<any[]>([])
  useEffect(() => { fetchData() }, [])
  async function fetchData() {
    const { data } = await supabase.from('calls').select('*').order('started_at', { ascending: false }).limit(10)
    if (data) setCalls(data)
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Nassar AI Dashboard</h1>
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-2">Recent Calls</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Time</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Outcome</th>
              <th className="p-2 text-left">Cost</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => (
              <tr key={call.id} className="border-b">
                <td className="p-2">{call.started_at ? format(new Date(call.started_at), 'PPpp') : '-'}</td>
                <td className="p-2">{call.status}</td>
                <td className="p-2">{call.outcome || '-'}</td>
                <td className="p-2">${((call.total_cost_cents || 0) / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
