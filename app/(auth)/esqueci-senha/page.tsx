'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, MailCheck, ArrowLeft } from 'lucide-react'
import { forgotPassword } from '@/lib/actions/auth'
import { AppLogo } from '@/components/app-logo'

export default function EsqueciSenhaPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const result = await forgotPassword(formData)
    if (result?.error) {
      setError('Não foi possível enviar o e-mail. Verifique o endereço.')
      setLoading(false)
      return
    }
    setSentEmail(email)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>
        <div className="w-full max-w-md relative z-10 animate-scale-in text-center">
          <div className="flex justify-center mb-8">
            <AppLogo size="lg" />
          </div>
          <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8">
            <div className="w-16 h-16 bg-blue-500/15 rounded-full flex items-center justify-center mx-auto mb-5">
              <MailCheck className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              E-mail enviado!
            </h1>
            <p className="text-slate-400 text-sm mb-4">
              Enviamos as instruções de recuperação para
            </p>
            <div className="bg-[#0f172a] rounded-xl px-4 py-3 mb-6">
              <p className="text-blue-400 font-medium text-sm break-all">{sentEmail}</p>
            </div>
            <p className="text-slate-500 text-xs mb-6">
              Clique no link do e-mail para criar uma nova senha. Verifique também a pasta de spam.
            </p>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    )
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
            Recuperar senha
          </h1>
          <p className="text-slate-400 text-sm">Digite seu e-mail para receber o link de recuperação</p>
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
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-300 text-sm transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
