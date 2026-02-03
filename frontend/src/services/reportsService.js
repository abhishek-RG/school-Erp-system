import api from './api'

export const reportsService = {
    getMonthlyExpenseReport: (params) =>
        api.get('/reports/monthly-expense/', { params }),

    getBudgetVsActual: (params) =>
        api.get('/reports/budget-vs-actual/', { params }),

    getIncomeVsExpense: (params) =>
        api.get('/reports/income-vs-expense/', { params }),

    getDepartmentSummary: (params) =>
        api.get('/reports/department-summary/', { params }),
}

export default reportsService
