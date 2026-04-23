'use client'

import { useState, useTransition } from 'react'
import { Loader2, Plus, X } from 'lucide-react'
import type { Transaction } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'
import { createUserCategory } from '@/lib/actions/categories'
import { toast } from 'sonner'

interface Props {
  defaultValues?: Partial<Transaction>
  userCategories?: string[]
  onSubmit: (formData: FormData) => Promise<void>
  onCancel: () => void
}

export function TransactionForm({ defaultValues, userCategories = [], onSubmit, onCancel }: Props) {
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'income' | 'expense'>(defaultValues?.type ?? 'expense')
  const [customCats, setCustomCats] = useState<string[]>(userCategories)
  const [addingCat, setAddingCat] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  function handleAddCatClick() {
    setAddingCat(true)
    setNewCatName('')
  }

  function handleCancelCat() {
    setAddingCat(false)
    setNewCatName('')
  }

  function handleSaveCat() {
    const name = newCatName.trim()
    if (!name) return
    startTransition(async () => {
      const result = await createUserCategory(name)
      if (result.error) {
        toast.error(result.error)
      } else {
        setCustomCats(prev => [...prev, name])
        setAddingCat(false)
        setNewCatName('')
        toast.success(`Categoria "${name}" criada!`)
      }
    })
  }

  const today = new Date().toLocaleDateString('en-CA')

  const inputClass = "w-full px-3 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type toggle */}
      <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 grid grid-cols-2 gap-1 shadow-sm">
        {(['expense', 'income'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`py-3 rounded-2xl text-sm font-semibold transition-all ${
              type === t
                ? t === 'expense'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t === 'expense' ? '💸 Despesa' : '💰 Receita'}
          </button>
        ))}
      </div>
      <input type="hidden" name="type" value={type} />

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Descrição</label>
        <input
          name="description"
          type="text"
          required
          defaultValue={defaultValues?.description}
          placeholder="Ex: Mercado, Salário, Netflix..."
          className={inputClass}
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">Use uma descrição clara para encontrar o lançamento mais rápido.</p>
      </div>

      {/* Amount */}
      <div className="space-y-2">
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
      <div className="space-y-2">
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
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Categoria</label>
          {!addingCat && (
            <button
              type="button"
              onClick={handleAddCatClick}
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nova categoria
            </button>
          )}
        </div>

        {addingCat ? (
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
            <input
              autoFocus
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); handleSaveCat() }
                if (e.key === 'Escape') handleCancelCat()
              }}
              placeholder="Nome da categoria..."
              maxLength={30}
              className={inputClass}
            />
            <button
              type="button"
              onClick={handleSaveCat}
              disabled={!newCatName.trim()}
              className="px-4 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold disabled:opacity-40 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCancelCat}
              className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <select
            name="category"
            required
            defaultValue={defaultValues?.category ?? ''}
            className={inputClass}
          >
            <option value="" disabled>Selecione uma categoria</option>
            <optgroup label="Padrão">
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </optgroup>
            {customCats.length > 0 && (
              <optgroup label="Minhas categorias">
                {customCats.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </optgroup>
            )}
          </select>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || addingCat}
          className={`w-full sm:flex-1 py-3 rounded-2xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 ${
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
