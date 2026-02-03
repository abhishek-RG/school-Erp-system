import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Building2, User, Save, X, Loader2 } from 'lucide-react'
import departmentService from '../../services/departmentService'
import userService from '../../services/userService'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/common/DataTable'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

export default function DepartmentList() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const queryClient = useQueryClient()

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            code: '',
            description: '',
            head: '',
            is_active: true
        }
    })

    // Fetch Departments
    const { data: response, isLoading } = useQuery({
        queryKey: ['departments'],
        queryFn: () => departmentService.getDepartments()
    })

    // Fetch Users for HOD selection
    const { data: usersResponse } = useQuery({
        queryKey: ['users'],
        queryFn: () => userService.getUsers()
    })

    const departments = response?.data?.results || (Array.isArray(response?.data) ? response.data : [])
    const users = usersResponse?.data?.results || (Array.isArray(usersResponse?.data) ? usersResponse.data : [])

    // Create Department Mutation
    const createMutation = useMutation({
        mutationFn: (data) => departmentService.createDepartment(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['departments'])
            toast.success('Department created successfully!')
            setIsModalOpen(false)
            reset()
        },
        onError: (error) => {
            const message = error.response?.data?.detail || error.response?.data?.name?.[0] || 'Failed to create department'
            toast.error(message)
        }
    })

    const onSubmit = (data) => {
        // Handle empty head (null)
        if (data.head === "") data.head = null
        createMutation.mutate(data)
    }

    const columns = [
        { header: 'Department Name', accessor: 'name' },
        {
            header: 'Code',
            accessor: 'code',
            cell: (row) => <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-1 rounded">{row.code}</span>
        },
        {
            header: 'HOD',
            accessor: 'head_name',
            cell: (row) => (
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                        <User size={12} className="text-primary-600" />
                    </div>
                    <span className="text-sm">{row.head_name || 'Not Assigned'}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'is_active',
            cell: (row) => (
                <Badge variant={row.is_active ? 'success' : 'neutral'}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </Badge>
            )
        },
        {
            header: 'Created At',
            accessor: 'created_at',
            cell: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Departments"
                description="Manage school departments and assign heads of departments."
                breadcrumbs={[
                    { name: 'Organization', path: '#' },
                    { name: 'Departments', path: '/departments' }
                ]}
                actions={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all font-bold active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Add Department</span>
                    </button>
                }
            />

            <DataTable
                columns={columns}
                data={departments}
                isLoading={isLoading}
                pagination={true}
            />

            {/* Add Department Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    reset()
                }}
                title="Create New Department"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Department Name</label>
                            <input
                                {...register('name', { required: 'Name is required' })}
                                className={`w-full px-4 py-3 bg-slate-50 border ${errors.name ? 'border-rose-300 focus:ring-rose-100' : 'border-slate-200 focus:ring-primary-100'} rounded-2xl focus:outline-none focus:ring-4 focus:border-primary-400 transition-all text-sm`}
                                placeholder="e.g. Science Department"
                            />
                            {errors.name && <p className="text-[11px] font-bold text-rose-500 ml-2 uppercase tracking-wider">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Department Code</label>
                            <input
                                {...register('code', { required: 'Code is required' })}
                                className={`w-full px-4 py-3 bg-slate-50 border ${errors.code ? 'border-rose-300 focus:ring-rose-100' : 'border-slate-200 focus:ring-primary-100'} rounded-2xl focus:outline-none focus:ring-4 focus:border-primary-400 transition-all text-sm`}
                                placeholder="e.g. SCI-01"
                            />
                            {errors.code && <p className="text-[11px] font-bold text-rose-500 ml-2 uppercase tracking-wider">{errors.code.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Head of Department (HOD)</label>
                        <select
                            {...register('head')}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm appearance-none"
                        >
                            <option value="">Select an HOD (Optional)</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all text-sm resize-none"
                            placeholder="Briefly describe the department's focus..."
                        />
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <input
                            type="checkbox"
                            {...register('is_active')}
                            id="is_active"
                            className="w-5 h-5 text-primary-600 border-slate-300 rounded-lg focus:ring-primary-500"
                        />
                        <label htmlFor="is_active" className="text-sm font-bold text-slate-700 cursor-pointer">
                            Mark as Active
                        </label>
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
                            <span>{createMutation.isPending ? 'Saving...' : 'Save Department'}</span>
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
