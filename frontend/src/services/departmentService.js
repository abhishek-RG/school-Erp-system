import api from './api'

export const departmentService = {
    getDepartments: (params) => api.get('/departments/', { params }),
    createDepartment: (data) => api.post('/departments/', data),
    updateDepartment: (id, data) => api.patch(`/departments/${id}/`, data),
    deleteDepartment: (id) => api.delete(`/departments/${id}/`),
}

export default departmentService
