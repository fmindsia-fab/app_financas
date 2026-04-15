import Link from 'next/link'
import { BarChart3, Tags, Download, TrendingUp, Shield, Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col">
      {/* Navbar */}
      <nav className="bg-white dark:bg-[#0f172a] sticky top-0 z-50 border-b border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-900 dark:text-white font-bold text-lg" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              Finanças
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors px-2">
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-slate-50 dark:bg-[#0f172a] pt-24 pb-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 animate-fade-up">
            <Zap className="w-3 h-3" />
            Controle financeiro simplificado
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6 animate-fade-up delay-100"
            style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
          >
            Suas finanças,{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              sob controle
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fade-up delay-200">
            Registre receitas e despesas, visualize gráficos por categoria e acompanhe seu saldo mensal.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up delay-300">
            <Link
              href="/cadastro"
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 inline-block"
            >
              Começar grátis →
            </Link>
            <Link
              href="/login"
              className="border border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium px-8 py-3.5 rounded-xl text-base transition-all hover:bg-slate-100 dark:hover:bg-white/5 inline-block"
            >
              Já tenho conta
            </Link>
          </div>

          {/* Dashboard preview mockup */}
          <div className="mt-16 animate-fade-up delay-400">
            <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-2xl p-4 max-w-2xl mx-auto shadow-xl dark:shadow-2xl dark:shadow-black/40">
              <div className="flex items-center gap-2 mb-4 opacity-40">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Receitas', value: 'R$ 8.500', color: 'from-emerald-500 to-emerald-600' },
                  { label: 'Despesas', value: 'R$ 5.200', color: 'from-red-500 to-red-600' },
                  { label: 'Saldo', value: 'R$ 3.300', color: 'from-blue-500 to-blue-600' },
                ].map((card) => (
                  <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-xl p-3 text-white`}>
                    <div className="text-xs opacity-80 mb-1">{card.label}</div>
                    <div className="font-bold text-sm">{card.value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 dark:bg-[#0f172a] rounded-xl p-3 flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  {[['Alimentação', '70%'], ['Transporte', '45%'], ['Moradia', '30%']].map(([cat, width]) => (
                    <div key={cat} className="flex items-center gap-2">
                      <div className="text-xs text-slate-500 dark:text-slate-400 w-24">{cat}</div>
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400" style={{ width }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-16 h-16 rounded-full border-[6px] border-emerald-500 border-r-blue-500 border-b-red-500 flex-shrink-0 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4"
              style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
            >
              Tudo que você precisa para organizar seu dinheiro
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              Funcionalidades pensadas para simplificar a gestão financeira pessoal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3, color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600',
                title: 'Dashboard Visual',
                description: 'Cards de resumo mensal com total de receitas, despesas e saldo. Gráficos de pizza por categoria.',
              },
              {
                icon: Tags, color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600',
                title: 'Categorias Inteligentes',
                description: 'Organize lançamentos em categorias como Alimentação, Transporte, Moradia. Filtre por mês ou busque por descrição.',
              },
              {
                icon: Download, color: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600',
                title: 'Exportar CSV',
                description: 'Exporte transações filtradas em CSV. Relatórios com gráficos mensais e resumo por categoria.',
              },
              {
                icon: Shield, color: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600',
                title: 'Dados Seguros',
                description: 'Seus dados são privados e protegidos. Cada usuário acessa apenas suas próprias transações.',
              },
              {
                icon: TrendingUp, color: 'bg-red-50 dark:bg-red-500/10 text-red-500',
                title: 'Relatórios Detalhados',
                description: 'Visualize a evolução dos últimos 6 meses com gráficos comparando receitas e despesas.',
              },
              {
                icon: Zap, color: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600',
                title: 'Notificações',
                description: 'Alertas automáticos quando o saldo fica negativo ou despesas altas são registradas.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800/50"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second CTA */}
      <section className="bg-[#0f172a] py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
          >
            Comece a controlar suas finanças hoje
          </h2>
          <p className="text-slate-400 mb-8">Gratuito, seguro e sem cartão de crédito.</p>
          <Link
            href="/cadastro"
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 inline-block"
          >
            Criar conta grátis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] border-t border-white/5 py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-md flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <span className="text-slate-400 text-sm">Finanças Pessoais</span>
          </div>
          <span className="text-slate-600 text-xs">© 2026</span>
        </div>
      </footer>
    </div>
  )
}
