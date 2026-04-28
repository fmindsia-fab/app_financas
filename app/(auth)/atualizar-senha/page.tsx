'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UpdatePasswordForm } from '@/components/update-password-form'
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AtualizarSenhaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [validSession, setValidSession] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    async function checkSession() {
      const supabase = createClient()

      // O cliente do browser detecta automaticamente o hash da URL (#access_token=...)
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        setValidSession(false)
        setLoading(false)
        return
      }

      setEmail(session.user.email ?? '')
      setValidSession(true)
      setLoading(false)
    }

    checkSession()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    )
  }

  if (!validSession) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        </div>
        <div className="w-full max-w-md relative z-10 animate-scale-in text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>F</span>
              </div>
              <span className="text-white font-bold text-2xl" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Fluxo360</span>
            </div>
          </div>
          <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8">
            <div className="w-16 h-16 bg-red-500/15 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              Link inválido
            </h1>
            <p className="text-slate-400 text-sm mb-6">
              Este link de recuperação expirou ou já foi usado. Solicite um novo link abaixo.
            </p>
            <Link
              href="/esqueci-senha"
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all block"
            >
              Solicitar novo link
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 mt-4 text-slate-400 hover:text-slate-300 text-sm transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
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
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>F</span>
              </div>
              <span className="text-white font-bold text-2xl" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Fluxo360</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Criar nova senha
          </h1>
          <p className="text-slate-400 text-sm">Olá, {email}. Escolha uma nova senha para sua conta.</p>
        </div>

        <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8">
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  )
}
