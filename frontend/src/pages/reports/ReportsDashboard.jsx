import { useQuery } from '@tanstack/react-query'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend
} from 'recharts'
import { Download, FileText, Filter, Calendar } from 'lucide-react'
import reportsService from '../../services/reportsService'
import PageHeader from '../../components/common/PageHeader'
import ChartContainer from '../../components/common/ChartContainer'

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6']

export default function ReportsDashboard() {
    const currentYear = new Date().getFullYear()
    const startDate = `${currentYear}-01-01`
    const endDate = `${currentYear}-12-31`

    const handleDownload = () => {
        const token = localStorage.getItem('access_token')
        const url = `http://localhost:8000/api/reports/audit-download/?start_date=${startDate}&end_date=${endDate}`

        // Use fetch with auth header to get the CSV
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `audit_report_${startDate}_to_${endDate}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(err => console.error('Download failed', err));
    }

    const { data: deptSummary } = useQuery({
        queryKey: ['deptSummary', startDate, endDate],
        queryFn: () => reportsService.getDepartmentSummary({ start_date: startDate, end_date: endDate })
    })

    const { data: monthlyExpense } = useQuery({
        queryKey: ['monthlyExpense', currentYear],
        queryFn: () => reportsService.getMonthlyExpenseReport({ month: new Date().getMonth() + 1, year: currentYear })
    })

    const { data: incomeVsExpense } = useQuery({
        queryKey: ['incomeVsExpenseFull', startDate, endDate],
        queryFn: () => reportsService.getIncomeVsExpense({ start_date: startDate, end_date: endDate })
    })

    const deptData = deptSummary?.data?.departments || []
    const incomeData = incomeVsExpense?.data?.summary ? [incomeVsExpense.data.summary] : []

    return (
        <div className="space-y-8">
            <PageHeader
                title="Financial Reports"
                description="Comprehensive financial reporting and audits for school administration."
                breadcrumbs={[
                    { name: 'Finance', path: '#' },
                    { name: 'Reports', path: '/reports' }
                ]}
                actions={
                    <button
                        onClick={handleDownload}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all font-bold active:scale-95"
                    >
                        <Download size={20} />
                        <span>Download Audit Report</span>
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Departmental Spending</h3>
                        <div className="flex items-center space-x-2">
                            <button className="p-1.5 hover:bg-slate-50 rounded"><Filter size={16} className="text-slate-400" /></button>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="department"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    width={120}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="expenses" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Expense Distribution</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={deptData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="expenses"
                                    nameKey="department"
                                >
                                    {(deptData).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                            </RePieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartContainer title="Monthly Revenue Trend" subtitle="Actual income received month over month">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={deptData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>

                <ChartContainer title="Expense Trend" subtitle="Comparison of categorized expenses">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={deptData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </div>
    )
}