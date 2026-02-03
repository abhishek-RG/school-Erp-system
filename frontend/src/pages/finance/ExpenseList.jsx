import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, TrendingDown, Save, X, Loader2, Building2, Calendar, CreditCard } from 'lucide-react'
import financeService from '../../services/financeService'
import departmentService from '../../services/departmentService'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/common/DataTable'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

export default function ExpenseList() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const queryClient = useQueryClient()

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            category: '',
            department: '',
            amount: '',
            date: format(new Date(), 'yyyy-MM-dd'),
            description: '',
            payment_mode: 'CASH',
            status: 'PENDING'
        }
    })

    // Fetch Expenses
    const { data: response, isLoading } = useQuery({
        queryKey: ['expenses'],
        queryFn: () => financeService.getExpenses()
    })

    // Fetch Categories
    const { data: catsResponse } = useQuery({
        queryKey: ['expenseCategories'],
        queryFn: () => financeService.getExpenseCategories()
    })

    // Fetch Departments
    const { data: deptsResponse } = useQuery({
        queryKey: ['departments'],
        queryFn: () => departmentService.getDepartments()
    })

    const expenses = response?.data?.results || (Array.isArray(response?.data) ? response.data : [])
    const categories = catsResponse?.data?.results || (Array.isArray(catsResponse?.data) ? catsResponse.data : [])
    const departments = deptsResponse?.data?.results || (Array.isArray(deptsResponse?.data) ? deptsResponse.data : [])

    // Create Expense Mutation
    const createMutation = useMutation({
        mutationFn: (data) => financeService.createExpense(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['expenses'])
            toast.success('Expense recorded successfully!')
            setIsModalOpen(false)
            reset()
        },
        onError: (error) => {
            toast.error(error.response?.data?.detail || 'Failed to record expense')
        }
    })

    const onSubmit = (data) => {
        createMutation.mutate(data)
    }

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(val || 0)

    const getStatusVariant = (status) => {
        switch (status) {
            case 'PAID': return 'success'
            case 'APPROVED': return 'info'
            case 'PENDING': return 'warning'
            case 'REJECTED': return 'danger'
            default: return 'neutral'
        }
    }

    const columns = [
        { header: 'Description', accessor: 'description' },
        {
            header: 'Category',
            accessor: 'category_name',
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-700">{row.category_name}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{row.department_name}</span>
                </div>
            )
        },
        {
            header: 'Amount',
            accessor: 'amount',
            cell: (row) => (
                <span className="font-bold text-slate-900">{formatCurrency(row.amount)}</span>
            )
        },
        {
            header: 'Date',
            accessor: 'date',
            cell: (row) => row.date ? format(new Date(row.date), 'dd MMM yyyy') : 'N/A'
        },
        {
            header: 'Status',
            accessor: 'status',
            cell: (row) => (
                <Badge variant={getStatusVariant(row.status)}>
                    {row.status}
                </Badge>
            )
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Expenses"
                description="Manage operational costs, salaries, and infrastructure spending."
                breadcrumbs={[
                    { name: 'Finance', path: '#' },
                    { name: 'Expenses', path: '/finance/expenses' }
                ]}
                actions={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all font-bold active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Add Expense</span>
                    </button>
                }
            />

            <DataTable
                columns={columns}
                data={expenses}
                isLoading={isLoading}
                pagination={true}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    reset()
                }}
                title="Record New Expense"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Expense Description</label>
                        <input
                            {...register('description', { required: 'Description is required' })}
                            className={`w-full px-4 py-3 bg-slate-50 border ${errors.description ? 'border-rose-300' : 'border-slate-200'} rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm`}
                            placeholder="e.g. Monthly Electricity Bill"
                        />
                        {errors.description && <p className="text-[11px] font-bold text-rose-500 ml-2 uppercase tracking-wider">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                            <select
                                {...register('category', { required: 'Category is required' })}
                                className={`w-full px-4 py-3 bg-slate-50 border ${errors.category ? 'border-rose-300' : 'border-slate-200'} rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm appearance-none`}
                            >
                                <option value="">Select category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.category && <p className="text-[11px] font-bold text-rose-500 ml-2 uppercase tracking-wider">{errors.category.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Department</label>
                            <select
                                {...register('department', { required: 'Department is required' })}
                                className={`w-full px-4 py-3 bg-slate-50 border ${errors.department ? 'border-rose-300' : 'border-slate-200'} rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm appearance-none`}
                            >
                                <option value="">Select department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                            {errors.department && <p className="text-[11px] font-bold text-rose-500 ml-2 uppercase tracking-wider">{errors.department.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Amount (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('amount', { required: 'Amount is required' })}
                                className={`w-full px-4 py-3 bg-slate-50 border ${errors.amount ? 'border-rose-300' : 'border-slate-200'} rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm`}
                                placeholder="0.00"
                            />
                            {errors.amount && <p className="text-[11px] font-bold text-rose-500 ml-2 uppercase tracking-wider">{errors.amount.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Date</label>
                            <input
                                type="date"
                                {...register('date', { required: 'Date is required' })}
                                className={`w-full px-4 py-3 bg-slate-50 border ${errors.date ? 'border-rose-300' : 'border-slate-200'} rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm`}
                            />
                            {errors.date && <p className="text-[11px] font-bold text-rose-500 ml-2 uppercase tracking-wider">{errors.date.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Payment Mode</label>
                            <select
                                {...register('payment_mode')}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm appearance-none"
                            >
                                <option value="CASH">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="BANK">Bank Transfer</option>
                                <option value="CHEQUE">Cheque</option>
                                <option value="CARD">Card</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Initial Status</label>
                            <select
                                {...register('status')}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm appearance-none"
                            >
                                <option value="PENDING">Pending Approval</option>
                                <option value="APPROVED">Already Approved</option>
                                <option value="PAID">Mark as Paid</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="flex-2 px-8 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-70"
                        >
                            {createMutation.isPending ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            <span>{createMutation.isPending ? 'Saving...' : 'Add Expense'}</span>
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}