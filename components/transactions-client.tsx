'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Pencil, Trash2, ArrowUpRight, ArrowDownRight, CheckCircle2, Circle } from 'lucide-react'
import { toast } from 'sonner'
import type { Transaction } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'
import { formatCurrency, formatDate, MONTH_NAMES } from '@/lib/utils'
import { createTransaction, updateTransaction, deleteTransaction, toggleSettled } from '@/lib/actions/transactions'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { TransactionForm } from '@/components/transaction-form'

interface Props {
  transactions: Transaction[]
  currentMes: number
  currentAno: number
  currentCategoria: string
  currentQ: string
}

const categoryEmoji: Record<string, string> = {
  Alimentação: '🍔', Transporte: '🚗', Moradia: '🏠',
  Lazer: '🎮', Saúde: '💊', Educação: '📚',
  Salário: '💼', Freelance: '💻', Outros: '📦',
}

const YEARS = [2023, 2024, 2025, 2026, 2027]

const selectClass = "px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#1e293b] text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"

export function TransactionsClient({ transactions, currentMes, currentAno, currentCategoria, currentQ }: Props) {
  const router = useRouter()

  const [openCreate, setOpenCreate] = useState(false)
  const [editTx, setEditTx] = useState<Transaction | null>(null)
  const [q, setQ] = useState(currentQ)
  const [settledMap, setSettledMap] = useState<Record<string, boolean>>(
    () => Object.fromEntries(transactions.map(t => [t.id, t.settled]))
  )
  const [, startTransition] = useTransition()

  async function handleToggleSettled(t: Transaction) {
    const newValue = !settledMap[t.id]
    setSettledMap(prev => ({ ...prev, [t.id]: newValue }))
    startTransition(async () => {
      const result = await toggleSettled(t.id, newValue)
      if (result.error) {
        setSettledMap(prev => ({ ...prev, [t.id]: !newValue }))
        toast.error(result.error)
      }
    })
  }

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams()
    params.set('mes', String(currentMes))
    params.set('ano', String(currentAno))
    params.set('categoria', currentCategoria)
    params.set('q', currentQ)
    Object.entries(updates).forEach(([k, v]) => params.set(k, v))
    router.push(`/transacoes?${params.toString()}`)
  }

  async function handleCreate(formData: FormData) {
    const result = await createTransaction(formData)
    if (result.error) { toast.error(result.error); return }
    toast.success('Transação criada!')
    setOpenCreate(false)
  }

  async function handleUpdate(formData: FormData) {
    if (!editTx) return
    const result = await updateTransaction(editTx.id, formData)
    if (result.error) { toast.error(result.error); return }
    toast.success('Transação atualizada!')
    setEditTx(null)
  }

  async function handleDelete(id: string) {
    const result = await deleteTransaction(id)
    if (result.error) { toast.error(result.error); return }
    toast.success('Transação excluída!')
  }

  return (
    <div className="space-y-4">
      {/* Filters + New button */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700/50 p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <select value={currentMes} onChange={e => updateParams({ mes: e.target.value })} className={selectClass}>
            {MONTH_NAMES.map((name, i) => (
              <option key={i} value={i + 1}>{name}</option>
            ))}
          </select>

          <select value={currentAno} onChange={e => updateParams({ ano: e.target.value })} className={selectClass}>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select value={currentCategoria} onChange={e => updateParams({ categoria: e.target.value })} className={selectClass}>
            <option value="all">Todas as categorias</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && updateParams({ q })}
              placeholder="Buscar por descrição..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#1e293b] text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Sheet open={openCreate} onOpenChange={setOpenCreate}>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all ml-auto">
                <Plus className="w-4 h-4" />
                Nova Transação
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Nova Transação</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <TransactionForm onSubmit={handleCreate} onCancel={() => setOpenCreate(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
        {transactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-3xl">📭</div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">Nenhuma transação encontrada</p>
              <p className="text-sm">Tente ajustar os filtros ou adicione uma nova transação.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Descrição</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden sm:table-cell">Categoria</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden md:table-cell">Data</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tipo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Valor</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{categoryEmoji[t.category] ?? '📦'}</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]">{t.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden sm:table-cell">{t.category}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell">{formatDate(t.date)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                        t.type === 'income'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}>
                        {t.type === 'income'
                          ? <ArrowUpRight className="w-3 h-3" />
                          : <ArrowDownRight className="w-3 h-3" />}
                        {t.type === 'income' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <button
                        onClick={() => handleToggleSettled(t)}
                        title={settledMap[t.id]
                          ? (t.type === 'income' ? 'Marcar como não recebido' : 'Marcar como não pago')
                          : (t.type === 'income' ? 'Marcar como recebido' : 'Marcar como pago')}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                          settledMap[t.id]
                            ? t.type === 'income'
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                              : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                            : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:border-emerald-300 hover:text-emerald-600'
                        }`}
                      >
                        {settledMap[t.id]
                          ? <CheckCircle2 className="w-3.5 h-3.5" />
                          : <Circle className="w-3.5 h-3.5" />}
                        {settledMap[t.id]
                          ? (t.type === 'income' ? 'Recebido' : 'Pago')
                          : (t.type === 'income' ? 'A receber' : 'A pagar')}
                      </button>
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold transition-opacity ${
                      settledMap[t.id]
                        ? t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
                        : 'text-slate-400 dark:text-slate-500 opacity-50'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Sheet open={editTx?.id === t.id} onOpenChange={open => !open && setEditTx(null)}>
                          <SheetTrigger asChild>
                            <button
                              onClick={() => setEditTx(t)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Editar Transação</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6">
                              {editTx && (
                                <TransactionForm
                                  defaultValues={editTx}
                                  onSubmit={handleUpdate}
                                  onCancel={() => setEditTx(null)}
                                />
                              )}
                            </div>
                          </SheetContent>
                        </Sheet>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. A transação &quot;{t.description}&quot; será excluída permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(t.id)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
