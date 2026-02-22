import { createAsyncThunk } from '@reduxjs/toolkit'

import { pastillaService } from '@/services/pastilla.service'

export const fetchPastillas = createAsyncThunk(
    'pastillas/fetchPastillas',
    async () => {
        const response = await pastillaService.getAll()
        return response
    },
)
