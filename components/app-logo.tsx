import Image from 'next/image'
import Link from 'next/link'

interface Props {
  href?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  version?: string
}

const sizes = {
  sm: { img: 28, title: 'text-base', sub: 'text-[10px]', version: 'text-[9px]' },
  md: { img: 36, title: 'text-lg', sub: 'text-[11px]', version: 'text-[10px]' },
  lg: { img: 44, title: 'text-xl', sub: 'text-xs', version: 'text-[11px]' },
}

export function AppLogo({ href = '/', size = 'md', className = '', version }: Props) {
  const s = sizes[size]

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.png"
        alt="Fluxo360"
        width={s.img}
        height={s.img}
        className="rounded-xl flex-shrink-0"
        priority
      />
      <div className="flex flex-col leading-none">
        <span className={`flex items-baseline gap-1.5 font-bold text-slate-900 dark:text-white ${s.title}`}
          style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
        >
          Fluxo360
          {version && (
            <span className={`text-slate-400 dark:text-slate-500 font-normal ${s.version}`}>
              v{version}
            </span>
          )}
        </span>
        <span className={`text-slate-400 dark:text-slate-500 font-normal ${s.sub} mt-0.5`}>
          by FMinds
        </span>
      </div>
    </div>
  )

  return href ? <Link href={href}>{content}</Link> : content
}
