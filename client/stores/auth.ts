import { defineStore } from 'pinia'

interface User {
    guid: string
    fio: string
    birth_date: string
    email: string
    phone: string
    created_at: string
    updated_at: string
}

interface AuthState {
    accessToken: string | null
    refreshToken: string | null
    user: User | null
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        accessToken: null,
        refreshToken: null,
        user: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.accessToken,
    },

    actions: {
        // ✅ Сохраняем оба токена
        setTokens(accessToken: string) {
            this.accessToken = accessToken

            const accessTokenCookie = useCookie<string>('access_token', {
                maxAge: 60 * 60 * 24, // 1 день
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                path: '/'
            })
            accessTokenCookie.value = accessToken
        },

        // For future methods (function poxyi)
        setUser(user: User) {
            this.user = user
        },

        loadTokens() {
            const accessTokenCookie = useCookie<string | null>('access_token')

            if (accessTokenCookie.value) {
                this.accessToken = accessTokenCookie.value
            }
        },

        async fetchUser() {
            if (!this.accessToken) return

            try {
                const { data, error } = await useFetch('/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`
                    }
                })

                if (error.value) {
                    throw error.value
                }

                this.user = data.value
            } catch (error) {
                console.error('Ошибка получения пользователя:', error)
                this.logout()
            }
        },

        logout() {
            this.accessToken = null
            this.refreshToken = null
            this.user = null

            const accessTokenCookie = useCookie<string | null>('access_token')

            accessTokenCookie.value = null
        }
    }
})