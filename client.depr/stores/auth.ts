import { defineStore } from 'pinia'
import {useCookie} from "nuxt/app";
import * as axios from "axios";

// intefrace from users
interface User
{
    id: number,
    email: string,
    role: string
}

// interface from auth state manager
// save user date and token
interface authState
{
    toker: string | null,
    user: User | null,
}

export const useAuthStore = defineStore('auth', {
    // default value = null, but me save new value
    state: authState => ({
        token: null,
        user: null,
    }),

    actions: {
        setToken(token:string)
        {
            this.toker = token;
            const tokenCookie = useCookie<string | null> ('auth_token', {sameSite: 'strict'});
            tokenCookie.value = token;
        },

        loadToken()
        {
            const tokenCookie = useCookie<string | null>('auth_token');
            this.token = tokenCookie.value;
        },

        async fetchUser()
        {
            if (!this.token) return;
            try
            {
                const response = await $axios.get<User>('/api/auth');
                this.user = response.data;
            }
            catch (error)
            {
                this.logout();
            }
        },

        logout()
        {
            this.token = null;
            this.user = null;
            const tokenCookie = useCookie<string | null>('auth_token');
            tokenCookie.value = null;
        },

        get isAdmin(): boolean
        {
            return this.user?.role == 'admin';
        }
    }
})

