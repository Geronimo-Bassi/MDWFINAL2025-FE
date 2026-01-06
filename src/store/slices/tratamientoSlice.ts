import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { tratamientoService } from '../../services/tratamiento.service'
import type { Tratamiento } from '../../types/models.types'

// ============================================
// ESTADO INICIAL
// ============================================
interface TratamientoState {
    tratamientos: Tratamiento[] // Los datos
    loading: boolean // ¿Está cargando?
    error: string | null // Mensaje de error (si hay)
}

const initialState: TratamientoState = {
    tratamientos: [],
    loading: false,
    error: null,
}

// ============================================
// THUNKS ASÍNCRONOS (Llamadas a la API)
// ============================================

// Obtener tratamientos por usuario
export const fetchTratamientosByUsuario = createAsyncThunk(
    'tratamientos/fetchByUsuario',
    async (usuarioId: string) => {
        const response = await tratamientoService.getByUsuario(usuarioId)
        return response
    }
)

// Crear tratamiento
export const createTratamiento = createAsyncThunk(
    'tratamientos/create',
    async (data: any) => {
        const response = await tratamientoService.create(data)
        return response
    }
)

// Actualizar tratamiento
export const updateTratamiento = createAsyncThunk(
    'tratamientos/update',
    async ({ id, data }: { id: string; data: any }) => {
        const response = await tratamientoService.update(id, data)
        return response
    }
)

// Cancelar tratamiento (cambiar estado)
export const cancelTratamiento = createAsyncThunk(
    'tratamientos/cancel',
    async (id: string) => {
        const response = await tratamientoService.updateEstado(id, 'cancelado')
        return response
    }
)

// ============================================
// SLICE
// ============================================
const tratamientoSlice = createSlice({
    name: 'tratamientos',
    initialState,
    reducers: {
        // Aquí podrías agregar acciones síncronas si las necesitas
        // Por ejemplo: limpiar el error manualmente
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        // ========== FETCH TRATAMIENTOS ==========
        builder
            .addCase(fetchTratamientosByUsuario.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchTratamientosByUsuario.fulfilled, (state, action) => {
                state.loading = false
                state.tratamientos = action.payload
            })
            .addCase(fetchTratamientosByUsuario.rejected, (state, action) => {
                state.loading = false
                state.error =
                    action.error.message || 'Error al cargar tratamientos'
            })

        // ========== CREATE TRATAMIENTO ==========
        builder
            .addCase(createTratamiento.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createTratamiento.fulfilled, (state, action) => {
                state.loading = false
                state.tratamientos.push(action.payload)
            })
            .addCase(createTratamiento.rejected, (state, action) => {
                state.loading = false
                state.error =
                    action.error.message || 'Error al crear tratamiento'
            })

        // ========== UPDATE TRATAMIENTO ==========
        builder
            .addCase(updateTratamiento.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateTratamiento.fulfilled, (state, action) => {
                state.loading = false
                const index = state.tratamientos.findIndex(
                    (t) => t._id === action.payload._id
                )
                if (index !== -1) {
                    state.tratamientos[index] = action.payload
                }
            })
            .addCase(updateTratamiento.rejected, (state, action) => {
                state.loading = false
                state.error =
                    action.error.message || 'Error al actualizar tratamiento'
            })

        // ========== CANCEL TRATAMIENTO ==========
        builder
            .addCase(cancelTratamiento.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(cancelTratamiento.fulfilled, (state, action) => {
                state.loading = false
                // Remover el tratamiento cancelado de la lista
                state.tratamientos = state.tratamientos.filter(
                    (t) => t._id !== action.payload._id
                )
            })
            .addCase(cancelTratamiento.rejected, (state, action) => {
                state.loading = false
                state.error =
                    action.error.message || 'Error al cancelar tratamiento'
            })
    },
})

export const { clearError } = tratamientoSlice.actions
export default tratamientoSlice.reducer
