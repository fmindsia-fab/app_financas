import Link from 'next/link'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Props {
  totalIncome: number
  totalExpense: number
  balance: number
}

export function SummaryCards({ totalIncome, totalExpense, balance }: Props) {
  const cards = [
    {
      label: 'Receitas',
      value: totalIncome,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      delay: 'delay-100',
      href: '/transacoes?tipo=income',
    },
    {
      label: 'Despesas',
      value: totalExpense,
      icon: TrendingDown,
      gradient: 'from-red-500 to-red-600',
      bg: 'bg-red-50 dark:bg-red-500/10',
      iconColor: 'text-red-500 dark:text-red-400',
      delay: 'delay-200',
      href: '/transacoes?tipo=expense',
    },
    {
      label: 'Saldo',
      value: balance,
      icon: Wallet,
      gradient: balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-red-500 to-orange-500',
      bg: balance >= 0 ? 'bg-blue-50 dark:bg-blue-500/10' : 'bg-red-50 dark:bg-red-500/10',
      iconColor: balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-500 dark:text-red-400',
      delay: 'delay-300',
      href: '/transacoes',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {cards.map((card) => (
        <Link
          key={card.label}
          href={card.href}
          className={`bg-white dark:bg-slate-950 rounded-[28px] border border-slate-100 dark:border-slate-800 p-6 shadow-soft animate-fade-up ${card.delay} hover:-translate-y-0.5 transition-all block`}
        >
          <div className="flex items-center justify-between mb-4 gap-3">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{card.label}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {card.label === 'Saldo'
                  ? 'Saldo atual do mês'
                  : card.label === 'Receitas'
                    ? 'Entradas confirmadas'
                    : 'Saídas confirmadas'}
              </p>
            </div>
            <div className={`w-12 h-12 ${card.bg} rounded-3xl flex items-center justify-center shadow-sm`}>
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
          </div>
          <div
            className={`text-3xl sm:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r ${card.gradient}`}
            style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
          >
            {formatCurrency(card.value)}
          </div>
          <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${card.gradient} opacity-80`} style={{ width: '100%' }} />
          </div>
        </Link>
      ))}
    </div>
  )
}
