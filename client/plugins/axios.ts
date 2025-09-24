import axios from 'axios'
import {defineNuxtPlugin, useRuntimeConfig} from "nuxt/app";
import {useAuthStore} from "../stores/auth";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    const instance = axios.create({
        baseURL: config.public.apiBaseUrl,
        withCredentials: true, // если нужны cookie
    })

    // перехватчик запросов (например, токен)
    instance.interceptors.request.use((request) => {
        const auth = useAuthStore()
        if (auth.token) {
            request.headers.Authorization = `Bearer ${auth.token}`
        }
        return request
    })

    // перехватчик ответов
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            // обработка ошибок
            console.error(error)
            return Promise.reject(error)
        }
    )

    return {
        provide: {
            axios: instance,
        },
    }
})
