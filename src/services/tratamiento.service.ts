import axiosInstance from '../lib/axios'
import type { ApiResponse } from '../types/api.types'
import type { Tratamiento, CreateTratamientoDto } from '../types/models.types'

const BASE_PATH = '/api/tratamientos'

export const tratamientoService = {
    // Obtener todos los tratamientos
    async getAll(): Promise<Tratamiento[]> {
        const response = await axiosInstance.get<ApiResponse<Tratamiento[]>>(
            BASE_PATH
        )
        return response.data.data
    },

    // Obtener un tratamiento por ID
    async getById(id: string): Promise<Tratamiento> {
        const response = await axiosInstance.get<ApiResponse<Tratamiento>>(
            `${BASE_PATH}/${id}`
        )
        return response.data.data
    },

    // Crear un nuevo tratamiento
    async create(data: CreateTratamientoDto): Promise<Tratamiento> {
        const response = await axiosInstance.post<ApiResponse<Tratamiento>>(
            BASE_PATH,
            data
        )
        return response.data.data
    },

    // Actualizar un tratamiento
    async update(
        id: string,
        data: Partial<CreateTratamientoDto>
    ): Promise<Tratamiento> {
        const response = await axiosInstance.put<ApiResponse<Tratamiento>>(
            `${BASE_PATH}/${id}`,
            data
        )
        return response.data.data
    },

    // Eliminar un tratamiento (soft delete)
    async delete(id: string): Promise<void> {
        await axiosInstance.delete(`${BASE_PATH}/${id}`)
    },

    // Eliminar permanentemente (hard delete)
    async hardDelete(id: string): Promise<void> {
        await axiosInstance.delete(`${BASE_PATH}/${id}?hard=true`)
    },
}
