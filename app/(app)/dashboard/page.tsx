import { createClient } from '@/lib/supabase/server'
import { SummaryCards } from '@/components/summary-cards'
import { CategoryPieChart } from '@/components/category-pie-chart'
import { RecentTransactions } from '@/components/recent-transactions'
import { IncomeExpenseChart } from '@/components/income-expense-chart'
import type { Transaction } from '@/lib/types'

const MONTH_ABBR = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function getSixMonthsData(transactions: Transaction[], year: number) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const data: { month: string; income: number; expense: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const targetMonth = currentMonth - i
    const targetYear = targetMonth < 0 ? year - 1 : year
    const monthIndex = ((targetMonth % 12) + 12) % 12
    const monthNum = monthIndex + 1
    const monthKey = `${targetYear}-${String(monthNum).padStart(2, '0')}`

    const monthTx = transactions.filter(t => t.date.startsWith(monthKey))
    const income = monthTx.filter(t => t.type === 'income' && t.settled).reduce((s, t) => s + t.amount, 0)
    const expense = monthTx.filter(t => t.type === 'expense' && t.settled).reduce((s, t) => s + t.amount, 0)

    data.push({ month: MONTH_ABBR[monthIndex], income, expense })
  }
  return data
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const end = new Date(year, month, 0).toISOString().split('T')[0]

  const sixMonthsAgo = new Date(year, now.getMonth() - 5, 1)
  const sixMonthsStart = `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, '0')}-01`

  const { data: monthlyTx } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user!.id)
    .gte('date', sixMonthsStart)
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

  const currentMonthTx = transactions.filter(t => {
    const d = t.date
    return d.startsWith(`${year}-${String(month).padStart(2, '0')}`)
  })

  const totalIncome = currentMonthTx.filter(t => t.type === 'income' && t.settled).reduce((s, t) => s + t.amount, 0)
  const totalExpense = currentMonthTx.filter(t => t.type === 'expense' && t.settled).reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpense

  const chartData = getSixMonthsData(transactions, year)

  const monthName = now.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Resumo de {monthName}</p>
      </div>

      <SummaryCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
      />

      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700/50 p-6 shadow-sm">
        <h2 className="font-bold text-slate-900 dark:text-white mb-1" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
          Receitas vs Despesas
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">Clique nas barras para ver os lançamentos do mês</p>
        <IncomeExpenseChart transactionsByMonth={chartData} currentYear={year} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700/50 p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Despesas por Categoria
          </h2>
          <CategoryPieChart transactions={currentMonthTx} />
        </div>

        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700/50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
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
