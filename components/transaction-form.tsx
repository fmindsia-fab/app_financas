'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { Transaction } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'

interface Props {
  defaultValues?: Partial<Transaction>
  onSubmit: (formData: FormData) => Promise<void>
  onCancel: () => void
}

export function TransactionForm({ defaultValues, onSubmit, onCancel }: Props) {
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'income' | 'expense'>(defaultValues?.type ?? 'expense')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await onSubmit(formData)
    setLoading(false)
  }

  const today = new Date().toISOString().split('T')[0]

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
        {(['expense', 'income'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
              type === t
                ? t === 'expense'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {t === 'expense' ? '💸 Despesa' : '💰 Receita'}
          </button>
        ))}
      </div>
      <input type="hidden" name="type" value={type} />

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Descrição</label>
        <input
          name="description"
          type="text"
          required
          defaultValue={defaultValues?.description}
          placeholder="Ex: Mercado, Salário, Netflix..."
          className={inputClass}
        />
      </div>

      {/* Amount */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Valor (R$)</label>
        <input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          required
          defaultValue={defaultValues?.amount}
          placeholder="0,00"
          className={inputClass}
        />
      </div>

      {/* Date */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Data</label>
        <input
          name="date"
          type="date"
          required
          defaultValue={defaultValues?.date ?? today}
          className={inputClass}
        />
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Categoria</label>
        <select
          name="category"
          required
          defaultValue={defaultValues?.category ?? ''}
          className={inputClass}
        >
          <option value="" disabled>Selecione uma categoria</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 ${
            type === 'expense'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-emerald-500 hover:bg-emerald-600'
          } disabled:opacity-50`}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Salvando...' : defaultValues?.id ? 'Salvar alterações' : 'Criar transação'}
        </button>
      </div>
    </form>
  )
}
