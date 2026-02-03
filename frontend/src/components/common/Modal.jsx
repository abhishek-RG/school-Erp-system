import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
                >
                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8">
                        {children}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
