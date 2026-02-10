import { useState, useEffect, useMemo } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { userService } from '../services/user.service'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchAllTratamientosByUsuario as fetchAllTratamientosByUsuarioAction } from '../store/slices/tratamientoSlice'
import type { User } from '../types/models.types'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function Historial() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    // Redux hooks
    const dispatch = useAppDispatch()
    const {
        tratamientos,
        loading: loadingTratamientos,
        error: errorTratamientos,
    } = useAppSelector((state) => state.tratamientos)

    const [dbUser, setDbUser] = useState<User | null>(null)

    // Cargar usuario de la base de datos
    useEffect(() => {
        const fetchDbUser = async () => {
            if (!user?.email) return

            try {
                const users = await userService.getAll()
                const foundUser = users.find((u) => u.email === user.email)
                if (foundUser) {
                    setDbUser(foundUser)
                }
            } catch (error) {
                console.error('Error al cargar usuario:', error)
            }
        }

        fetchDbUser()
    }, [user])

    // Cargar tratamientos del usuario
    useEffect(() => {
        if (dbUser?._id) {
            dispatch(fetchAllTratamientosByUsuarioAction(dbUser._id))
        }
    }, [dbUser?._id, dispatch])

    // Filtrar solo tratamientos inactivos
    const tratamientosInactivos = useMemo(() => {
        return tratamientos.filter(
            (t) =>
                t.estado === 'finalizado' ||
                t.estado === 'cancelado' ||
                t.estado === 'suspendido',
        )
    }, [tratamientos])

    const handleSignOut = async () => {
        try {
            await signOut()
            navigate('/login')
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        }
    }

    // Función para obtener el color del badge según el estado
    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'finalizado':
                return <Badge className="bg-green-500">Finalizado</Badge>
            case 'cancelado':
                return <Badge className="bg-red-500">Cancelado</Badge>
            case 'suspendido':
                return <Badge className="bg-yellow-500">Suspendido</Badge>
            default:
                return <Badge>{estado}</Badge>
        }
    }

    // Función para calcular duración del tratamiento
    const calcularDuracion = (fechaInicio: string, fechaFin?: string) => {
        const inicio = new Date(fechaInicio)
        const fin = fechaFin ? new Date(fechaFin) : new Date()
        const diffTime = Math.abs(fin.getTime() - inicio.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* SIDEBAR - Izquierda */}
            <Sidebar onSignOut={handleSignOut} />

            {/* ÁREA PRINCIPAL */}
            <div className="flex-1 p-4 md:p-8 lg:p-10 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-2xl md:text-3xl">
                                Historial de Tratamientos
                            </CardTitle>
                            <CardDescription>
                                Tratamientos finalizados, cancelados y
                                suspendidos
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingTratamientos ? (
                                <p className="text-center text-gray-500 py-8">
                                    Cargando historial...
                                </p>
                            ) : errorTratamientos ? (
                                <p className="text-center text-red-500 py-8">
                                    Error: {errorTratamientos}
                                </p>
                            ) : tratamientosInactivos.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">
                                    No tienes tratamientos en el historial
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-600 mb-4">
                                        Mostrando {tratamientos.length}{' '}
                                        tratamientos totales (
                                        {tratamientosInactivos.length}{' '}
                                        inactivos)
                                    </p>
                                    {tratamientosInactivos.map(
                                        (tratamiento) => (
                                            <div
                                                key={tratamiento._id}
                                                className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-lg text-indigo-900">
                                                            {tratamiento.nombre}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {typeof tratamiento.pastilla ===
                                                            'string'
                                                                ? 'Pastilla'
                                                                : tratamiento
                                                                      .pastilla
                                                                      .nombre}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        {getEstadoBadge(
                                                            tratamiento.estado,
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-500">
                                                            Dosis
                                                        </p>
                                                        <p className="font-medium">
                                                            {tratamiento.dosis}{' '}
                                                            mg
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">
                                                            Frecuencia
                                                        </p>
                                                        <p className="font-medium">
                                                            {
                                                                tratamiento.frecuencia
                                                            }
                                                            x al día
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">
                                                            Fecha Inicio
                                                        </p>
                                                        <p className="font-medium">
                                                            {format(
                                                                new Date(
                                                                    tratamiento.fechaInicio,
                                                                ),
                                                                'dd/MM/yyyy',
                                                                { locale: es },
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">
                                                            Duración
                                                        </p>
                                                        <p className="font-medium">
                                                            {calcularDuracion(
                                                                tratamiento.fechaInicio,
                                                                tratamiento.fechaFin,
                                                            )}{' '}
                                                            días
                                                        </p>
                                                    </div>
                                                </div>

                                                {tratamiento.fechaFin && (
                                                    <div className="mt-3 pt-3 border-t">
                                                        <p className="text-xs text-gray-500">
                                                            Finalizado el{' '}
                                                            {format(
                                                                new Date(
                                                                    tratamiento.fechaFin,
                                                                ),
                                                                "dd 'de' MMMM 'de' yyyy",
                                                                { locale: es },
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Historial
