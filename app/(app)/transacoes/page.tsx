import { createClient } from '@/lib/supabase/server'
import { TransactionsClient } from '@/components/transactions-client'
import { getUserCategories } from '@/lib/actions/categories'
import type { Transaction, TransactionType } from '@/lib/types'

interface Props {
  searchParams: Promise<{ mes?: string; ano?: string; categoria?: string; q?: string; tipo?: string }>
}

export default async function TransacoesPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const now = new Date()
  const mes = parseInt(params.mes ?? String(now.getMonth() + 1))
  const ano = parseInt(params.ano ?? String(now.getFullYear()))

  const start = `${ano}-${String(mes).padStart(2, '0')}-01`
  const end = new Date(ano, mes, 0).toISOString().split('T')[0]

  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user!.id)
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: false })

  if (params.categoria && params.categoria !== 'all') {
    query = query.eq('category', params.categoria)
  }

  if (params.q) {
    query = query.ilike('description', `%${params.q}%`)
  }

  if (params.tipo === 'income' || params.tipo === 'expense') {
    query = query.eq('type', params.tipo as TransactionType)
  }

  const [{ data }, userCategories] = await Promise.all([query, getUserCategories()])
  const transactions: Transaction[] = data ?? []

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
          Transações
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{transactions.length} registro(s) encontrado(s)</p>
      </div>

      <TransactionsClient
        transactions={transactions}
        currentMes={mes}
        currentAno={ano}
        currentCategoria={params.categoria ?? 'all'}
        currentQ={params.q ?? ''}
        currentTipo={params.tipo ?? 'all'}
        userCategories={userCategories}
      />
    </div>
  )
}
