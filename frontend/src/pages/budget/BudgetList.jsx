import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Target, Save, X, Loader2, Building2, Calendar } from 'lucide-react'
import budgetService from '../../services/budgetService'
import departmentService from '../../services/departmentService'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/common/DataTable'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

export default function BudgetList() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const queryClient = useQueryClient()

    const currentYear = new Date().getFullYear()
    const financialYearString = `${currentYear - 2000}-${currentYear - 1999}` // e.g. 24-25

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            department: '',
            financial_year: financialYearString,
            allocated_amount: '',
            status: 'DRAFT',
            notes: ''
        }
    })

    // Fetch Budgets
    const { data: response, isLoading } = useQuery({
        queryKey: ['budgets'],
        queryFn: () => budgetService.getBudgets()
    })

    // Fetch Departments
    const { data: deptsResponse } = useQuery({
        queryKey: ['departments'],
        queryFn: () => departmentService.getDepartments()
    })

    const budgets = response?.data?.results || (Array.isArray(response?.data) ? response.data : [])
    const departments = deptsResponse?.data?.results || (Array.isArray(deptsResponse?.data) ? deptsResponse.data : [])

    // Create Budget Mutation
    const createMutation = useMutation({
        mutationFn: (data) => budgetService.createBudget(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['budgets'])
            toast.success('Budget plan created successfully!')
            setIsModalOpen(false)
            reset()
        },
        onError: (error) => {
            toast.error(error.response?.data?.detail || 'Failed to create budget plan')
        }
    })

    const onSubmit = (data) => {
        createMutation.mutate(data)
    }

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(val || 0)

    const columns = [
        {
            header: 'Department',
            accessor: 'department_name',
            cell: (row) => row.department_name
        },
        {
            header: 'Financial Year',
            accessor: 'financial_year'
        },
        {
            header: 'Allocated',
            accessor: 'allocated_amount',
            cell: (row) => (
                <span className="font-bold text-slate-900">{formatCurrency(row.allocated_amount)}</span>
            )
        },
        {
            header: 'Spent',
            accessor: 'spent_amount',
            cell: (row) => (
                <span className="text-slate-600">{formatCurrency(row.spent_amount)}</span>
            )
        },
        {
            header: 'Utilization',
            accessor: 'utilization_percentage',
            cell: (row) => (
                <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${row.utilization_percentage > 90 ? 'bg-rose-500' :
                                    row.utilization_percentage > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                            style={{ width: `${Math.min(row.utilization_percentage || 0, 100)}%` }}
                        ></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{row.utilization_percentage?.toFixed(1) || 0}%</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            cell: (row) => (
                <Badge variant={row.status === 'LOCKED' ? 'neutral' : (row.status === 'APPROVED' ? 'success' : 'warning')}>
                    {row.status}
                </Badge>
            )
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Budget Planning"
                description="Allocate and monitor department-wise budgets for the academic year."
                breadcrumbs={[
                    { name: 'Finance', path: '#' },
                    { name: 'Budget', path: '/budget' }
                ]}
                actions={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all font-bold active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Create Budget</span>
                    </button>
                }
            />

            <DataTable
                columns={columns}
                data={budgets}
                isLoading={isLoading}
                pagination={true}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    reset()
                }}
                title="Create New Budget"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Financial Year</label>
                            <input
                                {...register('financial_year', { required: 'FY is required' })}
                                className={`w-full px-4 py-3 bg-slate-50 border ${errors.financial_year ? 'border-rose-300' : 'border-slate-200'} rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm`}
                                placeholder="e.g. 24-25"
                            />
                            {errors.financial_year && <p className="text-[11px] font-bold text-rose-500 ml-2 uppercase tracking-wider">{errors.financial_year.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Allocated Amount (₹)</label>
                            <input
                                type="number"
                                step="1000"
                                {...register('allocated_amount', { required: 'Amount is required' })}
                                className={`w-full px-4 py-3 bg-slate-50 border ${errors.allocated_amount ? 'border-rose-300' : 'border-slate-200'} rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm`}
                                placeholder="0"
                            />
                            {errors.allocated_amount && <p className="text-[11px] font-bold text-rose-500 ml-2 uppercase tracking-wider">{errors.allocated_amount.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Initial Status</label>
                        <select
                            {...register('status')}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm appearance-none"
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="PENDING">Pending Approval</option>
                            <option value="APPROVED">Already Approved</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Planning Notes (Optional)</label>
                        <textarea
                            {...register('notes')}
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm resize-none"
                            placeholder="Add details about budget allocation strategy..."
                        />
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
                            <span>{createMutation.isPending ? 'Saving...' : 'Create Budget'}</span>
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}