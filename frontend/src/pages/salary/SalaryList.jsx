import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Users, Save, X, Loader2, Banknote, Calendar } from 'lucide-react'
import salaryService from '../../services/salaryService'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/common/DataTable'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { useState, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-hot-toast'

export default function SalaryList() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const queryClient = useQueryClient()

    const now = new Date()
    const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm({
        defaultValues: {
            employee: '',
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            base_amount: '',
            allowances: '0',
            deductions: '0',
            net_amount: '0',
            status: 'PENDING',
            notes: ''
        }
    })

    // Watch fields for net amount calculation
    const baseAmount = useWatch({ control, name: 'base_amount' })
    const allowances = useWatch({ control, name: 'allowances' })
    const deductions = useWatch({ control, name: 'deductions' })

    useEffect(() => {
        const net = (parseFloat(baseAmount) || 0) + (parseFloat(allowances) || 0) - (parseFloat(deductions) || 0)
        setValue('net_amount', net.toFixed(2))
    }, [baseAmount, allowances, deductions, setValue])

    // Fetch Salaries
    const { data: response, isLoading } = useQuery({
        queryKey: ['salaries'],
        queryFn: () => salaryService.getSalaries()
    })

    // Fetch Employees
    const { data: employeesResponse } = useQuery({
        queryKey: ['employees'],
        queryFn: () => salaryService.getEmployees()
    })

    const salaries = response?.data?.results || (Array.isArray(response?.data) ? response.data : [])
    const employees = employeesResponse?.data?.results || (Array.isArray(employeesResponse?.data) ? employeesResponse.data : [])

    // Create Salary Mutation
    const createMutation = useMutation({
        mutationFn: (data) => salaryService.createSalary(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['salaries'])
            toast.success('Payroll processed successfully!')
            setIsModalOpen(false)
            reset()
        },
        onError: (error) => {
            toast.error(error.response?.data?.detail || 'Failed to process payroll')
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
            header: 'Employee',
            accessor: 'employee_name',
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-800">{row.employee_name}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{row.employee_role || 'Staff'}</span>
                </div>
            )
        },
        {
            header: 'Period',
            accessor: 'month',
            cell: (row) => (
                <span className="text-sm font-medium text-slate-600">{row.month}/{row.year}</span>
            )
        },
        {
            header: 'Base Salary',
            accessor: 'base_amount',
            cell: (row) => formatCurrency(row.base_amount)
        },
        {
            header: 'Net Payable',
            accessor: 'net_amount',
            cell: (row) => (
                <span className="font-bold text-slate-900">{formatCurrency(row.net_amount)}</span>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            cell: (row) => (
                <Badge variant={row.status === 'PAID' ? 'success' : 'warning'}>
                    {row.status}
                </Badge>
            )
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Payroll Management"
                description="Manage employee salaries, allowances, and payment statuses."
                breadcrumbs={[
                    { name: 'Finance', path: '#' },
                    { name: 'Salary', path: '/salary' }
                ]}
                actions={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all font-bold active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Process Payroll</span>
                    </button>
                }
            />

            <DataTable
                columns={columns}
                data={salaries}
                isLoading={isLoading}
                pagination={true}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    reset()
                }}
                title="Process Monthly Salary"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Select Employee</label>
                        <select
                            {...register('employee', { required: 'Employee is required' })}
                            className={`w-full px-4 py-3 bg-slate-50 border ${errors.employee ? 'border-rose-300' : 'border-slate-200'} rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm appearance-none`}
                            onChange={(e) => {
                                const emp = employees.find(emp => emp.id == e.target.value)
                                if (emp) setValue('base_amount', emp.base_salary)
                            }}
                        >
                            <option value="">Choose an employee...</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name} ({emp.employee_id})</option>
                            ))}
                        </select>
                        {errors.employee && <p className="text-[11px] font-bold text-rose-500 ml-2 uppercase tracking-wider">{errors.employee.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Month</label>
                            <select {...register('month')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-100 transition-all text-sm appearance-none">
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en-US', { month: 'long' })}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Year</label>
                            <input type="number" {...register('year')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-100 transition-all text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Base Amount (₹)</label>
                            <input
                                type="number"
                                {...register('base_amount', { required: 'Base amount is required' })}
                                className={`w-full px-4 py-3 bg-slate-50 border ${errors.base_amount ? 'border-rose-300' : 'border-slate-200'} rounded-2xl focus:ring-4 focus:ring-primary-100 transition-all text-sm`}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Allowances (₹)</label>
                            <input type="number" {...register('allowances')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-100 transition-all text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Deductions (₹)</label>
                            <input type="number" {...register('deductions')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-100 transition-all text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Net Payable (₹)</label>
                            <input type="text" readOnly {...register('net_amount')} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-primary-700 text-sm cursor-not-allowed" />
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
                            <span>{createMutation.isPending ? 'Processing...' : 'Process Salary'}</span>
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}