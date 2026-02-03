import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) {
    const colorClasses = {
        primary: 'bg-primary-50 text-primary-600',
        success: 'bg-emerald-50 text-emerald-600',
        warning: 'bg-amber-50 text-amber-600',
        danger: 'bg-rose-50 text-rose-600',
        info: 'bg-sky-50 text-sky-600',
    }

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between"
        >
            <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${colorClasses[color] || colorClasses.primary}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center space-x-1 text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        <span>{trendValue}%</span>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
            </div>
        </motion.div>
    )
}
