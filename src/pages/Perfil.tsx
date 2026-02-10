import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { userService } from '../services/user.service'
import { useAppSelector } from '../store/hooks'
import type { User as DbUser } from '../types/models.types'
import { Card, CardContent } from '../components/ui/card'
import { differenceInYears, format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function Perfil() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const [dbUser, setDbUser] = useState<DbUser | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { tratamientos } = useAppSelector((state) => state.tratamientos)

    const handleSignOut = async () => {
        try {
            await signOut()
            navigate('/login')
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        }
    }

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        const fetchDbUser = async () => {
            try {
                // Primero intentar obtener por Firebase UID
                let userData = null
                try {
                    userData = await userService.getByFirebaseUid(user.uid)
                } catch (error: any) {
                    // Si no existe por UID, intentar sincronizar con email
                    if (error.response?.status === 404 && user.email) {
                        console.log(
                            'Usuario no encontrado por UID, intentando sincronizar...',
                        )
                        try {
                            // Intentar vincular el Firebase UID con el usuario existente
                            userData = await userService.updateFirebaseUid(
                                user.email,
                                user.uid,
                            )
                            console.log(
                                '✅ Firebase UID sincronizado exitosamente',
                            )
                        } catch (syncError) {
                            console.error(
                                'No se pudo sincronizar Firebase UID:',
                                syncError,
                            )
                            throw syncError
                        }
                    } else {
                        throw error
                    }
                }

                setDbUser(userData)
                setError(null)
            } catch (error) {
                console.error('Error al cargar usuario:', error)
                setError(
                    'No se pudo cargar tu perfil. Por favor, completa tu registro primero.',
                )
            }
        }

        fetchDbUser()
    }, [user, navigate])

    if (error) {
        return (
            <div className="flex h-screen">
                <Sidebar onSignOut={handleSignOut} />
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="max-w-md text-center">
                        <div className="mb-4 text-6xl">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Perfil no encontrado
                        </h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => navigate('/complete-profile')}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Completar Registro
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!dbUser) {
        return (
            <div className="flex h-screen">
                <Sidebar onSignOut={handleSignOut} />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">Cargando perfil...</p>
                </div>
            </div>
        )
    }

    // Calcular estadísticas
    const tratamientosActivos = tratamientos.filter(
        (t) => t.estado === 'activo',
    ).length
    const tratamientosFinalizados = tratamientos.filter(
        (t) => t.estado === 'finalizado',
    ).length
    const totalTratamientos = tratamientos.length
    const adherencia =
        totalTratamientos > 0
            ? Math.round((tratamientosFinalizados / totalTratamientos) * 100)
            : 0

    // Calcular edad
    const edad = differenceInYears(new Date(), new Date(dbUser.fechaNacimiento))

    // Obtener iniciales
    const iniciales = `${dbUser.nombre[0]}${dbUser.apellido[0]}`.toUpperCase()

    // Determinar método de login
    const metodoLogin =
        user?.providerData[0]?.providerId === 'google.com'
            ? '🔐 Google'
            : '📧 Email'

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar onSignOut={handleSignOut} />
            <div className="flex-1 overflow-auto">
                <div className="max-w-5xl mx-auto p-8">
                    {/* Header Diagonal con Gradiente */}
                    <div className="relative mb-8 overflow-hidden rounded-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 transform -skew-y-3 scale-110"></div>
                        <div className="relative p-8 text-white">
                            <div className="flex items-center gap-6">
                                {/* Badge Hexagonal con Iniciales */}
                                <div className="relative">
                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-lg">
                                        <span className="text-3xl font-bold">
                                            {iniciales}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">
                                        {dbUser.nombre} {dbUser.apellido}
                                    </h1>
                                    <p className="text-purple-100 text-lg">
                                        {dbUser.email}
                                    </p>
                                    {dbUser.createdAt && (
                                        <p className="text-purple-200 text-sm mt-2">
                                            Miembro desde{' '}
                                            {format(
                                                new Date(dbUser.createdAt),
                                                'MMMM yyyy',
                                                { locale: es },
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Burbujas de Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Burbuja 1: Activos */}
                        <div className="group">
                            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-blue-100">
                                <CardContent className="p-8 text-center">
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                        <span className="text-4xl font-bold">
                                            {tratamientosActivos}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 font-medium text-lg">
                                        Activos
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Burbuja 2: Finalizados */}
                        <div className="group">
                            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-green-100">
                                <CardContent className="p-8 text-center">
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                        <span className="text-4xl font-bold">
                                            {tratamientosFinalizados}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 font-medium text-lg">
                                        Finalizados
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Burbuja 3: Adherencia */}
                        <div className="group">
                            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-purple-100">
                                <CardContent className="p-8 text-center">
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                        <span className="text-4xl font-bold">
                                            {adherencia}%
                                        </span>
                                    </div>
                                    <p className="text-gray-700 font-medium text-lg">
                                        Adherencia
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Bento Grid - Datos Personales */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Card Edad */}
                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <p className="text-sm text-gray-500 mb-2">
                                    Edad
                                </p>
                                <p className="text-3xl font-bold text-purple-600">
                                    {edad}
                                </p>
                                <p className="text-xs text-gray-400">años</p>
                            </CardContent>
                        </Card>

                        {/* Card Nacimiento - Más ancho */}
                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow md:col-span-2">
                            <CardContent className="p-6">
                                <p className="text-sm text-gray-500 mb-2">
                                    Fecha de Nacimiento
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {format(
                                        new Date(dbUser.fechaNacimiento),
                                        "d 'de' MMMM 'de' yyyy",
                                        { locale: es },
                                    )}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Card Método de Login - Ancho completo */}
                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow md:col-span-3">
                            <CardContent className="p-6">
                                <p className="text-sm text-gray-500 mb-2">
                                    Método de Inicio de Sesión
                                </p>
                                <p className="text-2xl font-semibold text-gray-800">
                                    {metodoLogin}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
