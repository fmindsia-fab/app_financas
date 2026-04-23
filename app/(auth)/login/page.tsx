'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { login } from '@/lib/actions/auth'
import { AppLogo } from '@/components/app-logo'

const STORAGE_KEY = 'financas_remembered_email'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [savedEmail, setSavedEmail] = useState('')

  useEffect(() => {
    const email = localStorage.getItem(STORAGE_KEY)
    if (email) {
      setSavedEmail(email)
      setRememberMe(true)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY, email)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
    const result = await login(formData)
    if (result?.error) {
      setError('E-mail ou senha incorretos.')
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
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <AppLogo size="lg" />
          </div>
          <h1
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
          >
            Bem-vindo de volta
          </h1>
          <p className="text-slate-400 text-sm">Entre para acessar seu dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-slate-300 text-sm font-medium">E-mail</label>
              <input
                name="email"
                type="email"
                required
                defaultValue={savedEmail}
                key={savedEmail}
                placeholder="seu@email.com"
                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 text-sm font-medium">Senha</label>
                <Link href="/esqueci-senha" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
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

            <div className="flex items-center gap-2">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-[#0f172a] accent-blue-500 cursor-pointer"
              />
              <label htmlFor="remember-me" className="text-slate-400 text-sm cursor-pointer select-none">
                Lembrar e-mail
              </label>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Não tem conta?{' '}
            <Link href="/cadastro" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Criar conta grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
