import api from './api'

export const financeService = {
    // Income operations
    getIncomes: (params) => api.get('/finance/incomes/', { params }),
    createIncome: (data) => api.post('/finance/incomes/', data),
    updateIncome: (id, data) => api.patch(`/finance/incomes/${id}/`, data),
    deleteIncome: (id) => api.delete(`/finance/incomes/${id}/`),

    // Expense operations
    getExpenses: (params) => api.get('/finance/expenses/', { params }),
    createExpense: (data) => api.post('/finance/expenses/', data),
    updateExpense: (id, data) => api.patch(`/finance/expenses/${id}/`, data),
    deleteExpense: (id) => api.delete(`/finance/expenses/${id}/`),
    approveExpense: (id) => api.post(`/finance/expenses/${id}/approve/`),
    rejectExpense: (id) => api.post(`/finance/expenses/${id}/reject/`),
    markPaid: (id) => api.post(`/finance/expenses/${id}/mark_paid/`),

    // Categories
    getIncomeSources: () => api.get('/finance/income-sources/'),
    getExpenseCategories: () => api.get('/finance/expense-categories/'),
}

export default financeService
