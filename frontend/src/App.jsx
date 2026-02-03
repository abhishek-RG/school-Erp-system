import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './context/authStore'

// Pages
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import IncomeList from './pages/finance/IncomeList'
import ExpenseList from './pages/finance/ExpenseList'
import BudgetList from './pages/budget/BudgetList'
import ReportsDashboard from './pages/reports/ReportsDashboard'
import SalaryList from './pages/salary/SalaryList'
import DepartmentList from './pages/departments/DepartmentList'

// Layout
import MainLayout from './components/common/MainLayout'

import { Toaster } from 'react-hot-toast'

function App() {
    const { isAuthenticated } = useAuthStore()

    return (
        <>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={
                    isAuthenticated ? <MainLayout /> : <Navigate to="/login" />
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="departments" element={<DepartmentList />} />
                    <Route path="finance/income" element={<IncomeList />} />
                    <Route path="finance/expenses" element={<ExpenseList />} />
                    <Route path="budget" element={<BudgetList />} />
                    <Route path="reports" element={<ReportsDashboard />} />
                    <Route path="salary" element={<SalaryList />} />
                </Route>
            </Routes>
        </>
    )
}

export default App
