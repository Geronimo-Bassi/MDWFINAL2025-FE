import axiosInstance from '../lib/axios'
import type { ApiResponse } from '../types/api.types'
import type { Pastilla, CreatePastillaDto } from '../types/models.types'

const BASE_PATH = '/api/pastillas'

export const pastillaService = {
    // Obtener todas las pastillas
    async getAll(): Promise<Pastilla[]> {
        const response = await axiosInstance.get<ApiResponse<Pastilla[]>>(
            BASE_PATH
        )
        return response.data.data
    },

    // Obtener una pastilla por ID
    async getById(id: string): Promise<Pastilla> {
        const response = await axiosInstance.get<ApiResponse<Pastilla>>(
            `${BASE_PATH}/${id}`
        )
        return response.data.data
    },

    // Crear una nueva pastilla
    async create(data: CreatePastillaDto): Promise<Pastilla> {
        const response = await axiosInstance.post<ApiResponse<Pastilla>>(
            BASE_PATH,
            data
        )
        return response.data.data
    },

    // Actualizar una pastilla
    async update(
        id: string,
        data: Partial<CreatePastillaDto>
    ): Promise<Pastilla> {
        const response = await axiosInstance.put<ApiResponse<Pastilla>>(
            `${BASE_PATH}/${id}`,
            data
        )
        return response.data.data
    },

    // Eliminar una pastilla
    async delete(id: string): Promise<void> {
        await axiosInstance.delete(`${BASE_PATH}/${id}`)
    },
}
