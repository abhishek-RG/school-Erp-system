import { useQuery } from '@tanstack/react-query'
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    PieChart,
    Calendar,
    ArrowUpRight,
    Search
} from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    Legend,
    Cell
} from 'recharts'
import reportsService from '../../services/reportsService'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import ChartContainer from '../../components/common/ChartContainer'
import { StatCardSkeleton } from '../../components/common/Skeleton'

export default function Dashboard() {
    const currentYear = new Date().getFullYear()
    const startDate = `${currentYear}-01-01`
    const endDate = `${currentYear}-12-31`

    const { data: summaryResponse, isLoading: loadingSummary } = useQuery({
        queryKey: ['financialSummary', startDate, endDate],
        queryFn: () => reportsService.getIncomeVsExpense({ start_date: startDate, end_date: endDate })
    })

    const { data: budgetResponse, isLoading: loadingBudget } = useQuery({
        queryKey: ['budgetVsActual', currentYear],
        queryFn: () => reportsService.getBudgetVsActual({ financial_year: currentYear })
    })

    const { data: deptSummaryResponse, isLoading: loadingDept } = useQuery({
        queryKey: ['deptSummary', startDate, endDate],
        queryFn: () => reportsService.getDepartmentSummary({ start_date: startDate, end_date: endDate })
    })

    // Safely extract data
    const summary = summaryResponse?.data?.summary || {}
    const budgetData = budgetResponse?.data?.budgets || []
    const deptData = deptSummaryResponse?.data?.departments || []

    const stats = {
        totalIncome: summary.total_income || 0,
        totalExpenses: summary.total_expenses || 0,
        balance: summary.balance || 0,
        budgetUsed: budgetData.length > 0
            ? budgetData.reduce((acc, curr) => acc + (curr.utilization_percentage || 0), 0) / budgetData.length
            : 0
    }

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(val || 0)

    if (loadingSummary || loadingBudget || loadingDept) {
        return (
            <div className="space-y-8">
                <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-[400px] bg-slate-100 rounded-2xl animate-pulse" />
                    <div className="h-[400px] bg-slate-100 rounded-2xl animate-pulse" />
                </div>
            </div>
        )
    }

    const hasData = stats.totalIncome > 0 || stats.totalExpenses > 0 || budgetData.length > 0

    return (
        <div className="space-y-8">
            <PageHeader
                title="Financial Insights"
                description="Real-time balance, spending velocity, and budget compliance."
                actions={
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
                        <Calendar size={16} className="text-slate-400 mr-2" />
                        <span className="text-sm font-semibold text-slate-700">FY {currentYear}</span>
                    </div>
                }
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Income"
                    value={formatCurrency(stats.totalIncome)}
                    icon={Wallet}
                    color="success"
                    trend="up"
                    trendValue="Live"
                />
                <StatCard
                    title="Total Expenses"
                    value={formatCurrency(stats.totalExpenses)}
                    icon={TrendingDown}
                    color="danger"
                    trend="down"
                    trendValue="Live"
                />
                <StatCard
                    title="Net Balance"
                    value={formatCurrency(stats.balance)}
                    icon={TrendingUp}
                    color={stats.balance >= 0 ? "info" : "danger"}
                />
                <StatCard
                    title="Avg. Budget Used"
                    value={`${stats.budgetUsed.toFixed(1)}%`}
                    icon={PieChart}
                    color={stats.budgetUsed > 90 ? "danger" : "warning"}
                />
            </div>

            {!hasData && (
                <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">No data found for this period</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2 text-sm leading-relaxed">
                        Start by recording school income or department expenses to see your financial analytics here.
                    </p>
                </div>
            )}

            {hasData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ChartContainer
                        title="Revenue vs Expenditure"
                        subtitle="Departmental financial distribution"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="top" align="right" iconType="circle" />
                                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    <ChartContainer
                        title="Budget Compliance"
                        subtitle="Allocated vs Actual spending by department"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={budgetData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="top" align="right" iconType="circle" />
                                <Bar dataKey="allocated_budget" name="Budgeted" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="actual_spent" name="Spent" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            )}
        </div>
    )
}
