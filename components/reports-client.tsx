'use client'

import { useRouter } from 'next/navigation'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { Download } from 'lucide-react'
import type { Transaction } from '@/lib/types'
import { formatCurrency, MONTH_NAMES } from '@/lib/utils'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899', '#64748b']
const YEARS = [2023, 2024, 2025, 2026, 2027]

interface Props {
  transactions: Transaction[]
  currentMes: number
  currentAno: number
}

export function ReportsClient({ transactions, currentMes, currentAno }: Props) {
  const router = useRouter()

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams()
    params.set('mes', String(currentMes))
    params.set('ano', String(currentAno))
    Object.entries(updates).forEach(([k, v]) => params.set(k, v))
    router.push(`/relatorios?${params.toString()}`)
  }

  // Bar chart: last 6 months
  const barData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(currentAno, currentMes - 1 - (5 - i))
    const m = date.getMonth() + 1
    const y = date.getFullYear()
    const start = `${y}-${String(m).padStart(2, '0')}-01`
    const end = new Date(y, m, 0).toISOString().split('T')[0]
    const monthTx = transactions.filter(t => t.date >= start && t.date <= end)
    return {
      month: date.toLocaleString('pt-BR', { month: 'short' }),
      income: monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expense: monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    }
  })

  // Period transactions (selected month)
  const start = `${currentAno}-${String(currentMes).padStart(2, '0')}-01`
  const end = new Date(currentAno, currentMes, 0).toISOString().split('T')[0]
  const periodTx = transactions.filter(t => t.date >= start && t.date <= end)

  // Pie + summary by category
  const categoryMap = periodTx
    .filter(t => t.type === 'expense')
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount
      return acc
    }, {})

  const totalExpense = Object.values(categoryMap).reduce((s, v) => s + v, 0)
  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value, pct: totalExpense > 0 ? (value / totalExpense) * 100 : 0 }))
    .sort((a, b) => b.value - a.value)

  async function handleExport() {
    const params = new URLSearchParams({ mes: String(currentMes), ano: String(currentAno) })
    window.location.href = `/api/export?${params}`
  }

  return (
    <div className="space-y-6">
      {/* Period selector + export */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-wrap gap-3 items-center">
        <select
          value={currentMes}
          onChange={e => updateParams({ mes: e.target.value })}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {MONTH_NAMES.map((name, i) => (
            <option key={i} value={i + 1}>{name}</option>
          ))}
        </select>
        <select
          value={currentAno}
          onChange={e => updateParams({ ano: e.target.value })}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button
          onClick={handleExport}
          className="ml-auto flex items-center gap-2 bg-[#0f172a] hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2 className="font-bold text-slate-900 mb-6" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
          Receitas vs Despesas — Últimos 6 meses
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barCategoryGap="30%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v: number) => formatCurrency(v)}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend formatter={v => <span style={{ fontSize: '12px', color: '#64748b' }}>{v === 'income' ? 'Receitas' : 'Despesas'}</span>} />
              <Bar dataKey="income" name="income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie + summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Despesas por Categoria
          </h2>
          {categoryData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Nenhuma despesa no período</div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [formatCurrency(v), 'Total']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Resumo por Categoria
          </h2>
          {categoryData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Nenhuma despesa no período</div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-56">
              {categoryData.map((row, i) => (
                <div key={row.name} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700 truncate">{row.name}</span>
                      <span className="text-sm font-semibold text-slate-900 ml-2">{formatCurrency(row.value)}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 w-10 text-right">{row.pct.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
