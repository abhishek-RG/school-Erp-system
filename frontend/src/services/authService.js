import api from './api'

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login/', { email, password })
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access)
            localStorage.setItem('refresh_token', response.data.refresh)
            localStorage.setItem('user', JSON.stringify(response.data.user))
        }
        return response.data
    },

    register: async (userData) => {
        const response = await api.post('/auth/register/', userData)
        return response.data
    },

    logout: () => {
        localStorage.clear()
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    },
}

export default authService
