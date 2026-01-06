import { configureStore } from '@reduxjs/toolkit'
import tratamientoReducer from './slices/tratamientoSlice'

// Los otros reducers se importarán cuando los creemos
// import pastillaReducer from './slices/pastillaSlice'
// import userReducer from './slices/userSlice'

export const store = configureStore({
    reducer: {
        tratamientos: tratamientoReducer,
        // Los otros slices se registrarán aquí
        // pastillas: pastillaReducer,
        // user: userReducer,
    },
})

// Tipos de TypeScript para usar en toda la app
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
