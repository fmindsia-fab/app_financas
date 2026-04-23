'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { updatePassword } from '@/lib/actions/auth'
import { AppLogo } from '@/components/app-logo'

export default function AtualizarSenhaPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
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
        setError('Não foi possível atualizar a senha. O link pode ter expirado.')
        return
      }
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <AppLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Nova senha
          </h1>
          <p className="text-slate-400 text-sm">Escolha uma nova senha para sua conta</p>
        </div>

        <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-white font-semibold text-lg mb-2">Senha atualizada!</h2>
              <p className="text-slate-400 text-sm">Redirecionando para o dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-slate-300 text-sm font-medium">Nova senha</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 text-sm font-medium">Confirmar nova senha</label>
                <input
                  name="confirm"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Repita a nova senha"
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Salvando...' : 'Salvar nova senha'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
