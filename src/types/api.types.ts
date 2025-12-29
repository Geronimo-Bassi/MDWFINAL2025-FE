// Tipos genéricos para las respuestas de la API

export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
}

export interface ApiError {
    success: false
    message: string
    errors?: Record<string, string[]>
    statusCode?: number
}

export interface PaginatedResponse<T> {
    success: boolean
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}
