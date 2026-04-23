'use client'

import { useState } from 'react'
import { Eye, EyeOff, Loader2, CheckCircle2, KeyRound } from 'lucide-react'
import { updatePassword } from '@/lib/actions/auth'

export default function ConfiguracoesPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string

    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      const result = await updatePassword(formData)
      if (result?.error) {
        setError('Não foi possível atualizar a senha.')
        return
      }
      setSuccess(true)
      ;(e.target as HTMLFormElement).reset()
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
          Configurações
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gerencie as configurações da sua conta</p>
      </div>

      <div className="max-w-lg">
        <div className="bg-white dark:bg-slate-950 rounded-[28px] border border-slate-100 dark:border-slate-800 p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Alterar senha</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Escolha uma senha segura com pelo menos 6 caracteres</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nova senha</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Mínimo 6 caracteres"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirmar nova senha</label>
              <input
                name="confirm"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Repita a nova senha"
                className={inputClass}
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <p className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">Senha atualizada com sucesso!</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
