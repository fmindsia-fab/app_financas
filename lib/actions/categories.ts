'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function getUserCategories(): Promise<string[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('user_categories')
    .select('name')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  return (data ?? []).map(r => r.name)
}

export async function createUserCategory(name: string): Promise<{ error?: string; success?: boolean }> {
  const trimmed = name.trim()
  if (!trimmed || trimmed.length < 2) return { error: 'Nome muito curto' }
  if (trimmed.length > 30) return { error: 'Nome muito longo (máx. 30 caracteres)' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('user_categories')
    .insert({ user_id: user.id, name: trimmed })

  if (error) {
    if (error.code === '23505') return { error: 'Categoria já existe' }
    return { error: 'Erro ao criar categoria' }
  }

  revalidatePath('/transacoes')
  return { success: true }
}

export async function deleteUserCategory(name: string): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('user_categories')
    .delete()
    .eq('user_id', user.id)
    .eq('name', name)

  if (error) return { error: 'Erro ao excluir categoria' }

  revalidatePath('/transacoes')
  return { success: true }
}
