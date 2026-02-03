import { Search, Filter, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react'

export default function DataTable({
    columns,
    data,
    isLoading,
    onSearch,
    pagination,
    emptyMessage = "No data available"
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Table Header / Actions */}
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        onChange={(e) => onSearch?.(e.target.value)}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    {col.header}
                                </th>
                            ))}
                            <th className="px-6 py-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {columns.map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        </td>
                                    ))}
                                    <td className="px-6 py-4"></td>
                                </tr>
                            ))
                        ) : !Array.isArray(data) || data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center">
                                        <p className="font-medium">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                    {columns.map((col, j) => (
                                        <td key={j} className="px-6 py-4 text-sm text-slate-600">
                                            {col.cell ? col.cell(row) : (row ? row[col.accessor] : '')}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-medium">
                        Showing <span className="text-slate-900">1 to 10</span> of <span className="text-slate-900">{data.length}</span> results
                    </p>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50">
                            <ChevronLeft size={16} />
                        </button>
                        <button className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
