'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState, startTransition } from 'react'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { startTransition(() => setMounted(true)) }, [])

  if (!mounted) return <div className="w-8 h-8" />

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Alternar tema"
      title={isDark ? 'Modo claro' : 'Modo escuro'}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10 ${className ?? ''}`}
    >
      {isDark
        ? <Sun className="w-4 h-4 text-slate-300" />
        : <Moon className="w-4 h-4 text-slate-300" />
      }
    </button>
  )
}
