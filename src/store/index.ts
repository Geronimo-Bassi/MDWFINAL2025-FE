import { configureStore } from '@reduxjs/toolkit'
import tratamientoReducer from './slices/tratamientoSlice'



export const store = configureStore({
    reducer: {
        tratamientos: tratamientoReducer,
        
    },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
