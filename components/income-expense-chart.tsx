'use client'

import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { useTheme } from 'next-themes'
import { formatCurrency } from '@/lib/utils'

interface Props {
  transactionsByMonth: {
    month: string
    income: number
    expense: number
  }[]
  currentYear: number
}

export function IncomeExpenseChart({ transactionsByMonth, currentYear }: Props) {
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const axisColor = isDark ? '#94a3b8' : '#64748b'
  const gridColor = isDark ? '#334155' : '#e2e8f0'
  const tooltipBg = isDark ? '#1e293b' : '#fff'
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0'
  const tooltipColor = isDark ? '#f1f5f9' : '#0f172a'

  const tooltipStyle = {
    borderRadius: '12px',
    border: `1px solid ${tooltipBorder}`,
    background: tooltipBg,
    color: tooltipColor,
    fontSize: '12px',
  }

  function handleBarClick(data: { activePayload?: { payload: { month: string; income: number; expense: number } }[] }) {
    const payload = data?.activePayload?.[0]?.payload
    if (!payload) return
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const monthNum = monthNames.indexOf(payload.month) + 1
    if (monthNum < 1) return
    router.push(`/transacoes?mes=${monthNum}&ano=${currentYear}`)
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={transactionsByMonth} barGap={4} barCategoryGap="20%" onClick={handleBarClick}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: axisColor }}
            tickLine={false}
            axisLine={{ stroke: gridColor }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: axisColor }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`}
            width={48}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatCurrency(value),
              name === 'income' ? 'Receitas' : 'Despesas',
            ]}
            contentStyle={tooltipStyle}
            cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
          />
          <Legend
            formatter={(value: string) =>
              value === 'income' ? 'Receitas' : 'Despesas'
            }
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', color: axisColor }}
          />
          <Bar
            dataKey="income"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
            className="cursor-pointer"
          />
          <Bar
            dataKey="expense"
            fill="#ef4444"
            radius={[6, 6, 0, 0]}
            className="cursor-pointer"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
