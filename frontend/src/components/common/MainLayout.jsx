import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../context/authStore'

export default function MainLayout() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-8">
                            <h1 className="text-2xl font-bold text-primary-600">School ERP</h1>
                            <nav className="hidden md:flex space-x-6">
                                <Link to="/" className="text-gray-700 hover:text-primary-600">Dashboard</Link>
                                <Link to="/finance/income" className="text-gray-700 hover:text-primary-600">Income</Link>
                                <Link to="/finance/expenses" className="text-gray-700 hover:text-primary-600">Expenses</Link>
                                <Link to="/budget" className="text-gray-700 hover:text-primary-600">Budget</Link>
                                <Link to="/salary" className="text-gray-700 hover:text-primary-600">Salary</Link>
                                <Link to="/reports" className="text-gray-700 hover:text-primary-600">Reports</Link>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">{user?.email}</span>
                            <button onClick={handleLogout} className="btn-secondary text-sm">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    )
}
