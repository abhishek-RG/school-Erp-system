import api from './api'

export const budgetService = {
    getBudgets: (params) => api.get('/budget/', { params }),
    createBudget: (data) => api.post('/budget/', data),
    updateBudget: (id, data) => api.patch(`/budget/${id}/`, data),
    deleteBudget: (id) => api.delete(`/budget/${id}/`),
}

export default budgetService
