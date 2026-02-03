import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Wallet, Calendar, Building2, Save, X, Loader2, CreditCard } from 'lucide-react'
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

export default function IncomeList() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const queryClient = useQueryClient()

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            income_source: '',
            amount: '',
            date: format(new Date(), 'yyyy-MM-dd'),
            department: '',
            payment_mode: 'CASH',
            description: ''
        }
    })

    // Fetch Income Records
    const { data: response, isLoading } = useQuery({
        queryKey: ['incomes'],
        queryFn: () => financeService.getIncomes()
    })

    // Fetch Income Sources
    const { data: sourcesResponse } = useQuery({
        queryKey: ['incomeSources'],
        queryFn: () => financeService.getIncomeSources()
    })

    // Fetch Departments
    const { data: deptsResponse } = useQuery({
        queryKey: ['departments'],
        queryFn: () => departmentService.getDepartments()
    })

    const incomes = response?.data?.results || (Array.isArray(response?.data) ? response.data : [])
    const sources = sourcesResponse?.data?.results || (Array.isArray(sourcesResponse?.data) ? sourcesResponse.data : [])
    const departments = deptsResponse?.data?.results || (Array.isArray(deptsResponse?.data) ? deptsResponse.data : [])

    // Create Income Mutation
    const createMutation = useMutation({
        mutationFn: (data) => financeService.createIncome(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['incomes'])
            toast.success('Income record added successfully!')
            setIsModalOpen(false)
            reset()
        },
        onError: (error) => {
            toast.error(error.response?.data?.detail || 'Failed to add income record')
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
        { header: 'Source', accessor: 'source_name' },
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
            header: 'Department',
            accessor: 'department_name',
            cell: (row) => (
                <div className="flex items-center space-x-2">
                    <Building2 size={14} className="text-slate-400" />
                    <span>{row.department_name || 'General'}</span>
                </div>
            )
        },
        {
            header: 'Payment Mode',
            accessor: 'payment_mode',
            cell: (row) => (
                <Badge variant="info">{row.payment_mode || 'Cash'}</Badge>
            )
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Income"
                description="Track all incoming tuition fees, donations, and other receipts."
                breadcrumbs={[
                    { name: 'Finance', path: '#' },
                    { name: 'Income', path: '/finance/income' }
                ]}
                actions={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all font-bold active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Add Income</span>
                    </button>
                }
            />

            <DataTable
                columns={columns}
                data={incomes}
                isLoading={isLoading}
                pagination={true}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    reset()
                }}
                title="Record New Income"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Income Source</label>
                        <select
                            {...register('income_source', { required: 'Source is required' })}
                            className={`w-full px-4 py-3 bg-slate-50 border ${errors.income_source ? 'border-rose-300' : 'border-slate-200'} rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm appearance-none`}
                        >
                            <option value="">Select an income source</option>
                            {sources.map(source => (
                                <option key={source.id} value={source.id}>{source.name}</option>
                            ))}
                        </select>
                        {errors.income_source && <p className="text-[11px] font-bold text-rose-500 ml-2 uppercase tracking-wider">{errors.income_source.message}</p>}
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
                            <label className="text-sm font-bold text-slate-700 ml-1">Department</label>
                            <select
                                {...register('department')}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm appearance-none"
                            >
                                <option value="">General / No Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>

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
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Description (Optional)</label>
                        <textarea
                            {...register('description')}
                            rows={2}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm resize-none"
                            placeholder="Add reference number or notes..."
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
                            <span>{createMutation.isPending ? 'Saving...' : 'Add Income'}</span>
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}