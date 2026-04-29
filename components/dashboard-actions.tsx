'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { createTransaction } from '@/lib/actions/transactions'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { TransactionForm } from '@/components/transaction-form'
import { toast } from 'sonner'

interface Props {
  userCategories: string[]
}

export function DashboardActions({ userCategories }: Props) {
  const [openCreate, setOpenCreate] = useState(false)

  async function handleCreate(formData: FormData) {
    const result = await createTransaction(formData)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Transação criada!')
    setOpenCreate(false)
  }

  return (
    <Sheet open={openCreate} onOpenChange={setOpenCreate}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-sm font-semibold px-5 py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/20">
          <Plus className="w-4 h-4" />
          Nova Transação
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nova Transação</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <TransactionForm
            userCategories={userCategories}
            onSubmit={handleCreate}
            onCancel={() => setOpenCreate(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
