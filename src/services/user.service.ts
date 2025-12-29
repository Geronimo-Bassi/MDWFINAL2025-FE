import axiosInstance from '../lib/axios'
import type { ApiResponse } from '../types/api.types'
import type { User, CreateUserDto } from '../types/models.types'

const BASE_PATH = '/api/users'

export const userService = {
    // Obtener todos los usuarios
    async getAll(): Promise<User[]> {
        const response = await axiosInstance.get<ApiResponse<User[]>>(BASE_PATH)
        return response.data.data
    },

    // Obtener un usuario por ID
    async getById(id: string): Promise<User> {
        const response = await axiosInstance.get<ApiResponse<User>>(
            `${BASE_PATH}/${id}`
        )
        return response.data.data
    },

    // Crear un nuevo usuario
    async create(data: CreateUserDto): Promise<User> {
        const response = await axiosInstance.post<ApiResponse<User>>(
            BASE_PATH,
            data
        )
        return response.data.data
    },

    // Actualizar un usuario
    async update(id: string, data: Partial<CreateUserDto>): Promise<User> {
        const response = await axiosInstance.put<ApiResponse<User>>(
            `${BASE_PATH}/${id}`,
            data
        )
        return response.data.data
    },

    // Eliminar un usuario
    async delete(id: string): Promise<void> {
        await axiosInstance.delete(`${BASE_PATH}/${id}`)
    },

    // Asignar tratamiento a usuario
    async assignTratamiento(
        userId: string,
        tratamientoId: string
    ): Promise<User> {
        const response = await axiosInstance.post<ApiResponse<User>>(
            `${BASE_PATH}/${userId}/tratamientos`,
            { tratamientoId }
        )
        return response.data.data
    },
}
