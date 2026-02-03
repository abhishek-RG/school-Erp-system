import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Wallet,
    TrendingDown,
    PieChart,
    FileText,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    Building2,
    Banknote
} from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
    return twMerge(clsx(inputs))
}

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Departments', icon: Building2, path: '/departments' },
    { name: 'Income', icon: Wallet, path: '/finance/income' },
    { name: 'Expenses', icon: TrendingDown, path: '/finance/expenses' },
    { name: 'Budget', icon: PieChart, path: '/budget' },
    { name: 'Salary', icon: Banknote, path: '/salary' },
    { name: 'Reports', icon: FileText, path: '/reports' },
]

export default function Sidebar({ collapsed, setCollapsed }) {
    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 260 }}
            transition={{ type: 'tween', ease: 'circOut', duration: 0.25 }}
            className={cn(
                "h-full w-full bg-slate-900 text-slate-300 flex flex-col relative overflow-hidden"
            )}
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <Building2 className="w-8 h-8 text-primary-400 shrink-0" />
                {!collapsed && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-3 font-bold text-xl text-white truncate"
                    >
                        Finance ERP
                    </motion.span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center px-3 py-2.5 rounded-lg transition-colors group",
                            isActive
                                ? "bg-primary-600 text-white"
                                : "hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5 shrink-0 transition-colors",
                            "group-hover:text-white"
                        )} />
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="ml-3 font-medium"
                            >
                                {item.name}
                            </motion.span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="h-12 flex items-center justify-center border-t border-slate-800 hover:bg-slate-800 hover:text-white transition-all active:scale-95 duration-200"
            >
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
        </motion.aside>
    )
}
