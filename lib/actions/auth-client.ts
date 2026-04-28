'use client'

import { createClient } from '@/lib/supabase/client'

export async function updatePasswordAction(password: string): Promise<{ error?: string }> {
  if (!password || password.length < 6) {
    return { error: 'A senha deve ter pelo menos 6 caracteres' }
  }

  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { error: error.message }
  return {}
}
