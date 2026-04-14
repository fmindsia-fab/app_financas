import { createClient } from '@/lib/supabase/server'
import { SummaryCards } from '@/components/summary-cards'
import { CategoryPieChart } from '@/components/category-pie-chart'
import { RecentTransactions } from '@/components/recent-transactions'
import type { Transaction } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const end = new Date(year, month, 0).toISOString().split('T')[0]

  const { data: monthlyTx } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user!.id)
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: false })

  const { data: recentTx } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user!.id)
    .order('date', { ascending: false })
    .limit(5)

  const transactions: Transaction[] = monthlyTx ?? []
  const recent: Transaction[] = recentTx ?? []

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpense

  const monthName = now.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 capitalize" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
          Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">Resumo de {monthName}</p>
      </div>

      <SummaryCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Despesas por Categoria
          </h2>
          <CategoryPieChart transactions={transactions} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              Últimas Transações
            </h2>
            <a href="/transacoes" className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors">
              Ver todas →
            </a>
          </div>
          <RecentTransactions transactions={recent} />
        </div>
      </div>
    </div>
  )
}
