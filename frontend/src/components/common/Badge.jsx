import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const variants = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-100 text-rose-700 border-rose-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    info: 'bg-sky-100 text-sky-700 border-sky-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-primary-100 text-primary-700 border-primary-200',
}

export default function Badge({ children, variant = 'neutral', className }) {
    return (
        <span className={twMerge(
            clsx(
                "px-2.5 py-0.5 rounded-full text-xs font-bold border",
                variants[variant] || variants.neutral,
                className
            )
        )}>
            {children}
        </span>
    )
}
