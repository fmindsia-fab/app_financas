import type { Transaction } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface Props {
  transactions: Transaction[]
}

const categoryEmoji: Record<string, string> = {
  Alimentação: '🍔', Transporte: '🚗', Moradia: '🏠',
  Lazer: '🎮', Saúde: '💊', Educação: '📚',
  Salário: '💼', Freelance: '💻', Outros: '📦',
}

export function RecentTransactions({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-400 flex-col gap-2">
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-xl">
          📝
        </div>
        <p className="text-sm">Nenhuma transação ainda</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-base flex-shrink-0">
            {categoryEmoji[t.category] ?? '📦'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{t.description}</p>
            <p className="text-xs text-slate-400">{t.category} · {formatDate(t.date)}</p>
          </div>
          <div className={`flex items-center gap-1 text-sm font-semibold flex-shrink-0 ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
            {t.type === 'income'
              ? <ArrowUpRight className="w-3.5 h-3.5" />
              : <ArrowDownRight className="w-3.5 h-3.5" />}
            {formatCurrency(t.amount)}
          </div>
        </div>
      ))}
    </div>
  )
}
