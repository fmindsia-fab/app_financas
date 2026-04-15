'use client'

import { useTheme } from 'next-themes'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Transaction } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899', '#64748b']

interface Props {
  transactions: Transaction[]
}

export function CategoryPieChart({ transactions }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const expenses = transactions.filter(t => t.type === 'expense')

  const categoryMap = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + t.amount
    return acc
  }, {})

  const data = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const tooltipStyle = {
    borderRadius: '12px',
    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
    background: isDark ? '#1e293b' : '#fff',
    color: isDark ? '#f1f5f9' : '#0f172a',
    fontSize: '12px',
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 flex-col gap-2">
        <div className="w-16 h-16 rounded-full border-4 border-dashed border-slate-200 dark:border-slate-600 flex items-center justify-center">
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-sm">Nenhuma despesa neste mês</p>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'Total']}
            contentStyle={tooltipStyle}
          />
          <Legend
            formatter={(value) => (
              <span style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
