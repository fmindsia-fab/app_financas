import { createClient } from '@/lib/supabase/server'
import { ReportsClient } from '@/components/reports-client'
import type { Transaction } from '@/lib/types'

interface Props {
  searchParams: Promise<{ mes?: string; ano?: string }>
}

export default async function RelatoriosPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const now = new Date()
  const mes = parseInt(params.mes ?? String(now.getMonth() + 1))
  const ano = parseInt(params.ano ?? String(now.getFullYear()))

  // Last 6 months of data for bar chart
  const sixMonthsAgo = new Date(ano, mes - 7, 1)
  const periodEnd = new Date(ano, mes, 0)

  const { data: allData } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user!.id)
    .gte('date', sixMonthsAgo.toISOString().split('T')[0])
    .lte('date', periodEnd.toISOString().split('T')[0])
    .order('date', { ascending: false })

  const transactions: Transaction[] = allData ?? []

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
          Relatórios
        </h1>
        <p className="text-slate-500 text-sm mt-1">Análise detalhada das suas finanças</p>
      </div>
      <ReportsClient transactions={transactions} currentMes={mes} currentAno={ano} />
    </div>
  )
}
