import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'
import { EsqueciSenhaContent } from '@/components/esqueci-senha-content'

export default function EsqueciSenhaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
      </div>
    }>
      <EsqueciSenhaContent />
    </Suspense>
  )
}
