import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

// Base URL del backend (usa la variable de entorno, si no existe usa la de producción)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Crear instancia de axios con configuración base
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000, // 60 segundos (para dar tiempo a que despierte el backend de Render)
    headers: {
        'Content-Type': 'application/json',
    },
})

// Interceptor de request - se ejecuta antes de cada petición
axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // Obtener token de Firebase si el usuario está autenticado
        const { auth } = await import('../config/firebase.config')
        const user = auth.currentUser

        if (user) {
            try {
                const token = await user.getIdToken()
                config.headers.Authorization = `Bearer ${token}`
                console.log(' Token agregado al request')
            } catch (error) {
                console.error(' Error obteniendo token:', error)
            }
        }

        console.log(` Request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
    },
    (error: AxiosError) => {
        console.error(' Request Error:', error)
        return Promise.reject(error)
    },
)

// Interceptor de response - se ejecuta después de cada respuesta
axiosInstance.interceptors.response.use(
    (response) => {
        console.log(
            ` Response: ${response.config.method?.toUpperCase()} ${
                response.config.url
            }`,
            response.status,
        )
        return response
    },
    (error: AxiosError<any>) => {
        // Manejo global de errores
        if (error.response) {
            // El servidor respondió con un código de error
            console.error(' Response Error:', {
                status: error.response.status,
                data: error.response.data,
                url: error.config?.url,
            })

            // Extraer mensaje de error detallado
            const errorData = error.response.data
            let errorMessage = 'Error en la petición'

            if (errorData?.message) {
                errorMessage = errorData.message
            }

            // Si hay errores de validación de Joi, mostrarlos
            if (errorData?.errors) {
                const validationErrors = Object.entries(errorData.errors)
                    .map(([field, messages]) => {
                        const msgArray = Array.isArray(messages)
                            ? messages
                            : [messages]
                        return `${field}: ${msgArray.join(', ')}`
                    })
                    .join(' | ')
                errorMessage = `${errorMessage} - ${validationErrors}`
            }

            // Crear un error más descriptivo
            const enhancedError: any = new Error(errorMessage)
            enhancedError.response = error.response
            enhancedError.status = error.response.status

            // manejar errores específicos aquí
            switch (error.response.status) {
                case 400:
                    console.error(' Validación fallida:', errorMessage)
                    break
                case 401:
                    console.error(' No autorizado - Token inválido o expirado')
                    // Limpiar sesión y redirigir a login
                    import('../services/auth.service').then(
                        ({ authService }) => {
                            authService.signOut()
                        },
                    )
                    if (typeof window !== 'undefined') {
                        if (window.location.pathname !== '/iniciar-sesion') {
                            window.location.href = '/iniciar-sesion'
                        }
                    }
                    break
                case 404:
                    console.error('Recurso no encontrado')
                    break
                case 500:
                    console.error('Error del servidor')
                    break
            }

            return Promise.reject(enhancedError)
        } else if (error.request) {
            // La petición se hizo pero no hubo respuesta
            console.error(' No response from server:', error.message)
            console.error(
                `Verificar si el backend está corriendo en ${API_BASE_URL}`,
            )
        } else {
            // Algo pasó al configurar la petición
            console.error(' Error:', error.message)
        }

        return Promise.reject(error)
    },
)

export default axiosInstance
