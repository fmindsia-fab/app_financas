'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES, type Category, type TransactionType } from '@/lib/types'

function validateTransaction(data: FormData) {
  const description = data.get('description') as string
  const amount = parseFloat(data.get('amount') as string)
  const date = data.get('date') as string
  const type = data.get('type') as TransactionType
  const category = data.get('category') as Category

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
  if (!CATEGORIES.includes(category)) {
    return { error: 'Categoria inválida' }
  }

  return { data: { description: description.trim(), amount, date, type, category } }
}

export async function createTransaction(formData: FormData) {
  const validation = validateTransaction(formData)
  if (validation.error) return { error: validation.error }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

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
  const validation = validateTransaction(formData)
  if (validation.error) return { error: validation.error }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

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
