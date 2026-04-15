'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Eye, EyeOff, Loader2, MailCheck, ArrowRight, AlertCircle } from 'lucide-react'
import { register } from '@/lib/actions/auth'

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string
    const email = formData.get('email') as string

    if (password !== confirm) {
      setError('As senhas não coincidem.')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      setLoading(false)
      return
    }

    const result = await register(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setRegisteredEmail(email)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative z-10 animate-scale-in text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              Finanças
            </span>
          </Link>

          <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8">
            <div className="w-16 h-16 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-5">
              <MailCheck className="w-8 h-8 text-emerald-400" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              Verifique seu e-mail
            </h1>
            <p className="text-slate-400 text-sm mb-6">
              Enviamos um link de confirmação para
            </p>
            <div className="bg-[#0f172a] rounded-xl px-4 py-3 mb-6">
              <p className="text-blue-400 font-medium text-sm break-all">{registeredEmail}</p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-6 text-left">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-amber-300 text-sm">
                  Não encontrou o e-mail?{' '}
                  <strong className="text-amber-200">Verifique a pasta de spam</strong> ou lixo eletrônico.
                </p>
              </div>
            </div>

            <p className="text-slate-500 text-xs mb-6">
              Clique no link do e-mail para ativar sua conta e depois faça o login.
            </p>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Ir para o login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              Finanças
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Criar conta grátis
          </h1>
          <p className="text-slate-400 text-sm">Comece a controlar suas finanças agora</p>
        </div>

        <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-slate-300 text-sm font-medium">E-mail</label>
              <input
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 text-sm font-medium">Senha</label>
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
              <label className="text-slate-300 text-sm font-medium">Confirmar senha</label>
              <input
                name="confirm"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Repita a senha"
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
              {loading ? 'Criando conta...' : 'Criar conta grátis'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Já tem conta?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
