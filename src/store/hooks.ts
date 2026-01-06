import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

// Hook tipado para leer datos del store
// Uso: const tratamientos = useAppSelector((state) => state.tratamientos)
export const useAppSelector = useSelector.withTypes<RootState>()

// Hook tipado para disparar acciones
// Uso: const dispatch = useAppDispatch()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
