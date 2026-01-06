import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/user.service'
import { DatePicker } from '../components/DatePicker'

function Register() {
    const navigate = useNavigate()
    const { signUp } = useAuth()
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        fechaNacimiento: '',
        password: '',
        confirmPassword: '',
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
        const errorCode = error.code || ''

        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'Este email ya está registrado. Intenta iniciar sesión'
            case 'auth/invalid-email':
                return 'El formato del email no es válido'
            case 'auth/weak-password':
                return 'La contraseña es muy débil. Usa al menos 6 caracteres'
            case 'auth/network-request-failed':
                return 'Error de conexión. Verifica tu internet'
            case 'auth/too-many-requests':
                return 'Demasiados intentos. Intenta más tarde'
            default:
                return (
                    error.message || 'Error al registrarse. Intenta nuevamente'
                )
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        setLoading(true)

        try {
            // 1. Create user in Firebase
            await signUp(formData.email, formData.password)

            // 2. Create user in MongoDB
            const mongoUser = await userService.create({
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                fechaNacimiento: formData.fechaNacimiento,
            })

            // 3. Store MongoDB user ID in localStorage
            localStorage.setItem('mongoUserId', mongoUser._id)

            navigate('/dashboard')
        } catch (err: any) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Branding (hidden on mobile) */}
            <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-pink-500 to-rose-600 p-12 flex-col justify-center items-center text-white">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold mb-6">
                        ✨ Únete a Nosotros
                    </h1>
                    <p className="text-xl opacity-90 mb-12">
                        Crea tu cuenta y comienza a gestionar tratamientos de
                        manera profesional
                    </p>
                    <div className="flex gap-8 justify-center">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🎯</div>
                            <p className="text-sm">Fácil</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-2">💪</div>
                            <p className="text-sm">Potente</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-2">🌟</div>
                            <p className="text-sm">Gratis</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Crear Cuenta
                        </h2>
                        <p className="text-gray-600">
                            Completa el formulario para comenzar
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
                                Nombre
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="Tu nombre"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all disabled:bg-gray-100"
                            />
                        </div>

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
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all disabled:bg-gray-100"
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
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="nombre@ejemplo.com"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="Mínimo 6 caracteres"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="Repite tu contraseña"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all disabled:bg-gray-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-600">
                        ¿Ya tienes una cuenta?{' '}
                        <Link
                            to="/login"
                            className="text-pink-600 font-semibold hover:text-rose-700 transition-colors"
                        >
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register
