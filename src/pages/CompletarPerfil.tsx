import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { userService } from '../services/user.service'
import { DatePicker } from '../components/DatePicker'

interface LocationState {
    email: string
    nombre: string
}

function CompletarPerfil() {
    const navigate = useNavigate()
    const location = useLocation()
    const { email, nombre } = (location.state as LocationState) || {}

    const [formData, setFormData] = useState({
        apellido: '',
        fechaNacimiento: '',
        telefono: '',
    })
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const getErrorMessage = (error: any): string => {
        // Check if it's a backend validation error
        if (error.response?.data?.errors) {
            return error.response.data.errors.join(' | ')
        }

        // Check if it's a backend message
        if (error.response?.data?.message) {
            return error.response.data.message
        }

        // Generic error
        return 'Error al completar perfil. Intenta nuevamente'
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            // Create user in MongoDB
            const mongoUser = await userService.create({
                nombre,
                apellido: formData.apellido,
                email,
                fechaNacimiento: formData.fechaNacimiento,
                telefono: formData.telefono || undefined,
            })

            // Store MongoDB user ID
            localStorage.setItem('mongoUserId', mongoUser._id)

            navigate('/panel')
        } catch (err: any) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    if (!email || !nombre) {
        navigate('/iniciar-sesion')
        return null
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-8 bg-gray-50">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        ¡Bienvenido, {nombre}! 👋
                    </h2>
                    <p className="text-gray-600">
                        Completa tu perfil para continuar
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                        <span>⚠️</span>
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Apellido
                        </label>
                        <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="Tu apellido"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Fecha de Nacimiento
                        </label>
                        <DatePicker
                            value={formData.fechaNacimiento}
                            onChange={(date) =>
                                setFormData({
                                    ...formData,
                                    fechaNacimiento: date,
                                })
                            }
                            disabled={loading}
                            placeholder="Selecciona tu fecha de nacimiento"
                            maxDate={new Date()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Teléfono (WhatsApp){' '}
                            <span className="text-gray-400 text-xs">
                                (Opcional)
                            </span>
                        </label>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="+5491112345678"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all disabled:bg-gray-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            📱 Para recibir recordatorios de tus tratamientos
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Guardando...' : 'Continuar'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CompletarPerfil
