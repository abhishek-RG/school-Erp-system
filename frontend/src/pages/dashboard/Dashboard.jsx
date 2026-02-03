export default function Dashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Financial Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Income</h3>
                    <p className="text-3xl font-bold text-success-600">₹0</p>
                </div>
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Expenses</h3>
                    <p className="text-3xl font-bold text-danger-600">₹0</p>
                </div>
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Balance</h3>
                    <p className="text-3xl font-bold text-primary-600">₹0</p>
                </div>
            </div>
        </div>
    )
}
