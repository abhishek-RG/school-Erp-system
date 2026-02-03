import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useLocation } from 'react-router-dom'

export default function MainLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 1024)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const location = useLocation()

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsMobileOpen(false)
    }, [location])

    // Handle window resize for sidebar state
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarCollapsed(true)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 z-[60] lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* 1. Sidebar Component (Fixed positioning) */}
            <div
                className={`fixed inset-y-0 left-0 z-[70] transition-all duration-200 ease-in-out bg-slate-900 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } ${sidebarCollapsed ? 'w-20' : 'w-64'}`}
            >
                <Sidebar
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                />
            </div>

            {/* 2. Layout Spacer (Occupies space in the flex flow to prevent content from going behind Sidebar) */}
            <div
                className={`hidden lg:block transition-all duration-200 shrink-0 ${sidebarCollapsed ? 'w-20' : 'w-64'
                    }`}
            />

            {/* 3. Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-200">
                <Navbar onMenuClick={() => setIsMobileOpen(true)} />

                <main className="p-4 md:p-8 flex-1 min-h-[calc(100vh-64px)]">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
