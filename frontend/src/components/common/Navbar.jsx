import { Bell, User, LogOut, ChevronDown, Menu, Search } from 'lucide-react'
import { useAuthStore } from '../../context/authStore'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar({ onMenuClick }) {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-4 md:px-8">
            <div className="flex items-center space-x-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 hover:bg-slate-100 rounded-lg lg:hidden text-slate-600 transition-colors"
                    aria-label="Open Menu"
                >
                    <Menu size={20} />
                </button>

                <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-3 py-1.5 w-64 lg:w-96 border border-transparent focus-within:border-primary-400 focus-within:bg-white transition-all">
                    <Search size={16} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-6">
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-3 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-200">
                            {user?.first_name?.[0] || 'A'}
                        </div>
                        <div className="hidden lg:block text-left">
                            <p className="text-sm font-bold text-slate-800 leading-tight">{user?.first_name} {user?.last_name}</p>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                {user?.role?.replace('_', ' ') || 'Finance Admin'}
                            </p>
                        </div>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsProfileOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-slate-50 lg:hidden">
                                        <p className="text-sm font-bold text-slate-800">{user?.first_name} {user?.last_name}</p>
                                        <p className="text-xs text-slate-400">{user?.role}</p>
                                    </div>
                                    <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                        <User size={18} />
                                        <span>My Profile</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        <span>Sign Out</span>
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    )
}
