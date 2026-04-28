import Link from 'next/link'
import { BarChart3, Tags, Download, TrendingUp, Shield, Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { AppLogo } from '@/components/app-logo'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background flex flex-col">
      {/* Navbar */}
      <nav aria-label="Navegação principal" className="sticky top-0 z-50 bg-surface/85 dark:bg-background/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/70 shadow-soft">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <AppLogo size="md" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              aria-label="Entrar na sua conta"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors px-2 py-1 rounded-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              aria-label="Criar nova conta grátis"
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-2xl transition-all shadow-lg shadow-blue-500/20 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 outline-none"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section aria-label="Hero" className="relative pt-20 pb-28 px-4 sm:px-6 overflow-hidden">
          {/* Background decorators */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-success/8 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left column: Text + CTAs */}
              <div className="text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-6 animate-fade-up">
                  <Zap className="w-3.5 h-3.5" />
                  Controle financeiro simplificado
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-bold leading-[1.1] tracking-tight mb-6 animate-fade-up delay-100 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 dark:from-emerald-400 dark:via-blue-400 dark:to-primary bg-clip-text text-transparent">
                  Seu dinheiro em fluxo
                </h1>

                {/* Subtitle */}
                <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 mb-10 animate-fade-up delay-200">
                  Registre receitas e despesas, visualize gráficos por categoria e acompanhe seu saldo mensal com clareza.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up delay-300">
                  <Link
                    href="/cadastro"
                    aria-label="Começar cadastro grátis"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 outline-none"
                  >
                    Começar grátis →
                  </Link>
                  <Link
                    href="/login"
                    aria-label="Ir para página de login"
                    className="inline-flex items-center justify-center border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary font-medium px-8 py-4 rounded-xl text-base transition-all hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
                  >
                    Já tenho conta
                  </Link>
                </div>
              </div>

              {/* Right column: Dashboard mockup */}
              <div className="animate-fade-up delay-400">
                <div className="relative">
                  {/* Glow effect behind mockup */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-success/20 rounded-3xl blur-2xl opacity-50" />
                  <div className="relative bg-slate-900 dark:bg-[#0c1222] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Window dots */}
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-700/50 bg-slate-800/50">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <div className="ml-4 text-[10px] text-slate-500 font-mono">Fluxo360 — Dashboard</div>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Metric cards */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Receitas', value: 'R$ 8.500', change: '+12%' },
                          { label: 'Despesas', value: 'R$ 5.200', change: '-5%' },
                          { label: 'Saldo', value: 'R$ 3.300', change: '+18%' },
                        ].map((card) => (
                          <div key={card.label} className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/30">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">{card.label}</div>
                            <div className="text-sm font-bold text-white">{card.value}</div>
                            <div className={`text-[10px] mt-1 ${card.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                              {card.change}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bar chart */}
                      <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/30">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-3">Evolução Mensal</div>
                        <div className="flex items-end gap-2 h-24">
                          {[
                            { month: 'Jan', income: 65, expense: 40 },
                            { month: 'Fev', income: 50, expense: 55 },
                            { month: 'Mar', income: 80, expense: 45 },
                            { month: 'Abr', income: 70, expense: 50 },
                            { month: 'Mai', income: 90, expense: 60 },
                            { month: 'Jun', income: 75, expense: 42 },
                          ].map((bar) => (
                            <div key={bar.month} className="flex-1 flex flex-col items-center gap-1">
                              <div className="w-full flex gap-0.5 items-end h-20">
                                <div className="flex-1 bg-emerald-500/80 rounded-t-sm" style={{ height: `${bar.income}%` }} />
                                <div className="flex-1 bg-red-500/60 rounded-t-sm" style={{ height: `${bar.expense}%` }} />
                              </div>
                              <span className="text-[9px] text-slate-500">{bar.month}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Category bars */}
                      <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/30">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-3">Gastos por Categoria</div>
                        <div className="space-y-2.5">
                          {[
                            ['Alimentação', '70%', 'bg-emerald-400'],
                            ['Transporte', '45%', 'bg-blue-400'],
                            ['Moradia', '30%', 'bg-violet-400'],
                          ].map(([cat, width, barColor]) => (
                            <div key={cat} className="flex items-center gap-3">
                              <div className="text-[11px] text-slate-400 w-20">{cat}</div>
                              <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                                <div className={`h-2 rounded-full ${barColor}`} style={{ width }} />
                              </div>
                              <span className="text-[10px] text-slate-500 w-8 text-right">{width}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent transactions */}
                      <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/30">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-3">Transações Recentes</div>
                        <div className="space-y-2.5">
                          {[
                            { desc: 'Salário', date: 'Hoje', amount: '+ R$ 5.000', color: 'text-emerald-400' },
                            { desc: 'Supermercado', date: 'Ontem', amount: '- R$ 850', color: 'text-red-400' },
                            { desc: 'Transporte', date: '15/04', amount: '- R$ 320', color: 'text-red-400' },
                            { desc: 'Netflix', date: '10/04', amount: '- R$ 55', color: 'text-red-400' },
                          ].map((tx) => (
                            <div key={tx.desc} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-slate-700/50 flex items-center justify-center">
                                  <div className={`w-1.5 h-1.5 rounded-full ${tx.color === 'text-emerald-400' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                </div>
                                <div>
                                  <div className="text-[11px] text-slate-300">{tx.desc}</div>
                                  <div className="text-[9px] text-slate-500">{tx.date}</div>
                                </div>
                              </div>
                              <span className={`text-[11px] font-medium ${tx.color}`}>{tx.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features */}
        <section aria-label="Funcionalidades" className="py-24 px-4 sm:px-6 bg-surface dark:bg-background">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Tudo que você precisa para organizar seu dinheiro
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
                Funcionalidades pensadas para simplificar a gestão financeira pessoal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: BarChart3,
                  color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
                  title: 'Dashboard Visual',
                  description: 'Cards de resumo mensal com total de receitas, despesas e saldo. Gráficos de pizza por categoria.',
                },
                {
                  icon: Tags,
                  color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                  title: 'Categorias Inteligentes',
                  description: 'Organize lançamentos em categorias como Alimentação, Transporte, Moradia. Filtre por mês ou busque por descrição.',
                },
                {
                  icon: Download,
                  color: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400',
                  title: 'Exportar CSV',
                  description: 'Exporte transações filtradas em CSV. Relatórios com gráficos mensais e resumo por categoria.',
                },
                {
                  icon: Shield,
                  color: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
                  title: 'Dados Seguros',
                  description: 'Seus dados são privados e protegidos. Cada usuário acessa apenas suas próprias transações.',
                },
                {
                  icon: TrendingUp,
                  color: 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400',
                  title: 'Relatórios Detalhados',
                  description: 'Visualize a evolução dos últimos 6 meses com gráficos comparando receitas e despesas.',
                },
                {
                  icon: Zap,
                  color: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
                  title: 'Notificações',
                  description: 'Alertas automáticos quando o saldo fica negativo ou despesas altas são registradas.',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl border border-surface/30 hover:border-primary/40 hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-background-light dark:bg-surface/70 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                  tabIndex={0}
                  aria-label={feature.title}
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Second CTA */}
        <section aria-label="Chamada para ação" className="bg-background py-20 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Comece a controlar seu dinheiro hoje
            </h2>
            <p className="text-slate-400 mb-8">Gratuito, seguro e sem cartão de crédito.</p>
            <Link
              href="/cadastro"
              aria-label="Criar conta grátis agora"
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 inline-block focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 outline-none"
            >
              Criar conta grátis →
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer aria-label="Rodapé" className="bg-background border-t border-white/5 py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <AppLogo size="sm" className="opacity-70" />
          <span className="text-slate-600 text-xs">© 2026 Fluxo360 — by FMinds</span>
        </div>
      </footer>
    </div>
  )
}
