import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { pastillaService } from '@/services/pastilla.service'

import type { Pastilla } from '../../types/models.types'

interface PastillaState {
    pastillas: Pastilla[]
    loading: boolean
    error: string | null
}

const initialState: PastillaState = {
    pastillas: [],
    loading: false,
    error: null,
}

export const fetchPastillas = createAsyncThunk(
    'pastillas/fetchPastillas',
    async () => {
        const response = await pastillaService.getAll()
        return response
    }
)
