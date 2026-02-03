export default function ChartContainer({ title, children, subtitle }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
            <div className="w-full h-[300px]">
                {children}
            </div>
        </div>
    )
}
