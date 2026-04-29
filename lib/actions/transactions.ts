'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES, type TransactionType } from '@/lib/types'

async function validateTransaction(data: FormData, userId: string) {
  const description = data.get('description') as string
  const amount = parseFloat(data.get('amount') as string)
  const date = data.get('date') as string
  const type = data.get('type') as TransactionType
  const category = (data.get('category') as string)?.trim()

  if (!description || description.trim().length === 0) {
    return { error: 'Descrição é obrigatória' }
  }
  if (isNaN(amount) || amount <= 0) {
    return { error: 'Valor deve ser maior que zero' }
  }
  if (!date) {
    return { error: 'Data é obrigatória' }
  }
  if (!['income', 'expense'].includes(type)) {
    return { error: 'Tipo inválido' }
  }

  const isStandard = (CATEGORIES as readonly string[]).includes(category)
  if (!isStandard) {
    const supabase = await createClient()
    const { data: custom } = await supabase
      .from('user_categories')
      .select('name')
      .eq('user_id', userId)
      .eq('name', category)
      .single()
    if (!custom) return { error: 'Categoria inválida' }
  }

  return { data: { description: description.trim(), amount, date, type, category } }
}

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const validation = await validateTransaction(formData, user.id)
  if (validation.error) return { error: validation.error }

  const { error } = await supabase
    .from('transactions')
    .insert({ ...validation.data, user_id: user.id })

  if (error) return { error: 'Erro ao criar transação' }

  revalidatePath('/dashboard')
  revalidatePath('/transacoes')
  revalidatePath('/relatorios')
  return { success: true }
}

export async function updateTransaction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const validation = await validateTransaction(formData, user.id)
  if (validation.error) return { error: validation.error }

  const { error } = await supabase
    .from('transactions')
    .update(validation.data!)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Erro ao atualizar transação' }

  revalidatePath('/dashboard')
  revalidatePath('/transacoes')
  revalidatePath('/relatorios')
  return { success: true }
}

export async function toggleSettled(id: string, settled: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('transactions')
    .update({ settled })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Erro ao atualizar status' }

  revalidatePath('/dashboard')
  revalidatePath('/transacoes')
  revalidatePath('/relatorios')
  return { success: true }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Erro ao excluir transação' }

  revalidatePath('/dashboard')
  revalidatePath('/transacoes')
  revalidatePath('/relatorios')
  return { success: true }
}
