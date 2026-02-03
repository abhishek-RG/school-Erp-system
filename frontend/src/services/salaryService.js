import api from './api'

export const salaryService = {
    getSalaries: (params) => api.get('/salary/salaries/', { params }),
    createSalary: (data) => api.post('/salary/salaries/', data),
    updateSalary: (id, data) => api.patch(`/salary/salaries/${id}/`, data),
    getEmployees: (params) => api.get('/salary/employees/', { params }),
}

export default salaryService
