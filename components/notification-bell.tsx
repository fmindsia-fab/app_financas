'use client'

import { useState, useEffect } from 'react'
import { Bell, AlertTriangle, Info, AlertCircle } from 'lucide-react'
import type { Notification } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { generateNotifications } from '@/lib/utils/notifications'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const iconMap = {
  danger: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colorMap = {
  danger: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [read, setRead] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
      if (data) setNotifications(generateNotifications(data))
    }
    load()
  }, [])

  const unread = read ? 0 : notifications.length

  return (
    <DropdownMenu onOpenChange={(open) => open && setRead(true)}>
      <DropdownMenuTrigger asChild>
        <button className="relative w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] rounded-lg">
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {notifications.length > 0 && (
            <span className="text-xs text-slate-400 font-normal">{notifications.length} alerta(s)</span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="px-3 py-6 text-center text-slate-400 text-sm">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
            Nenhuma notificação
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = iconMap[n.type]
            return (
              <DropdownMenuItem key={n.id} className="flex items-start gap-3 py-3">
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colorMap[n.type]}`} />
                <span className="text-sm text-slate-700 leading-snug">{n.message}</span>
              </DropdownMenuItem>
            )
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
