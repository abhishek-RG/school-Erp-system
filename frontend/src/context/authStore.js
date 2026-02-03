import { create } from 'zustand'
import authService from '../services/authService'

export const useAuthStore = create((set) => ({
    user: authService.getCurrentUser(),
    isAuthenticated: !!localStorage.getItem('access_token'),

    login: async (email, password) => {
        const data = await authService.login(email, password)
        set({ user: data.user, isAuthenticated: true })
        return data
    },

    logout: () => {
        authService.logout()
        set({ user: null, isAuthenticated: false })
    },

    updateUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user))
        set({ user })
    },
}))
