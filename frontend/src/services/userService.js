import api from './api'

export const userService = {
    getUsers: (params) => api.get('/auth/users/', { params }),
}

export default userService
