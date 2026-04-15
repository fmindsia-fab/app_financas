import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/navbar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex flex-col">
      <Navbar user={user} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}
