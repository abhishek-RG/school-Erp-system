import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export default function Skeleton({ className, ...props }) {
    return (
        <div
            className={twMerge(clsx("animate-pulse rounded-md bg-slate-200", className))}
            {...props}
        />
    )
}

export function StatCardSkeleton() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-start justify-between">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <Skeleton className="w-16 h-6 rounded-full" />
            </div>
            <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
            </div>
        </div>
    )
}
