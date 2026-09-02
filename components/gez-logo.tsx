import { cn } from '@/lib/utils';

export function GezMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={cn('h-auto w-10', className)} viewBox="0 0 52 52" fill="none">
      <rect width="52" height="52" rx="17" fill="currentColor" />
      <path
        d="M11 31c3-8 2-16 10-18 8-2 13 5 8 10-4 4-11 0-8-5 4-7 17-6 20 2l4 4-4 4v10"
        stroke="#FFF9EC"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="31" r="3" fill="#E68A68" />
      <circle cx="41" cy="38" r="3" fill="#B8C7A5" />
    </svg>
  );
}

export function GezLogo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <GezMark className={light ? 'text-[#f8f2e7]' : 'text-[#31483b]'} />
      <span className="flex items-baseline gap-1.5 leading-none">
        <span className={cn('text-[1.38rem] font-extrabold tracking-[-0.075em]', light ? 'text-white' : 'text-[#26362e]')}>GƏZ</span>
        <span className={cn('text-[0.62rem] font-semibold tracking-[0.02em]', light ? 'text-white/55' : 'text-[#778078]')}>Walks</span>
      </span>
    </span>
  );
}
