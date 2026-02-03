import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PageHeader({ title, description, actions, breadcrumbs = [] }) {
    return (
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500 mb-2">
                    <Link to="/" className="hover:text-primary-600 transition-colors">
                        <Home size={14} />
                    </Link>
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <ChevronRight size={12} />
                            <Link
                                to={crumb.path}
                                className={index === breadcrumbs.length - 1 ? "text-slate-900 font-semibold" : "hover:text-primary-600 transition-colors"}
                            >
                                {crumb.name}
                            </Link>
                        </div>
                    ))}
                </nav>

                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
                {description && <p className="text-slate-500 text-sm mt-1">{description}</p>}
            </div>

            {actions && (
                <div className="flex items-center space-x-3">
                    {actions}
                </div>
            )}
        </div>
    )
}
