'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TrendingUp, LayoutDashboard, ArrowLeftRight, BarChart3, LogOut, User } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/actions/auth'
import { NotificationBell } from '@/components/notification-bell'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transacoes', label: 'Transações', icon: ArrowLeftRight },
  { href: '/relatorios', label: 'Relatórios', icon: BarChart3 },
]

export default function Navbar({ user }: { user: SupabaseUser }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="bg-[#0f172a] border-b border-white/5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg hidden sm:block" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Finanças
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{label}</span>
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <NotificationBell />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] ml-1">
                {user.email?.charAt(0).toUpperCase() ?? <User className="w-4 h-4" />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 cursor-pointer focus:text-red-500"
                onSelect={async () => {
                  await signOut()
                  router.push('/login')
                }}
              >
                <LogOut className="w-4 h-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
