import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/user.service'

function Login() {
    const navigate = useNavigate()
    const { signIn, signInWithGoogle } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const getErrorMessage = (error: any): string => {
        const errorCode = error.code || ''

        switch (errorCode) {
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                return 'Usuario o contraseña incorrectos'
            case 'auth/invalid-email':
                return 'El formato del email no es válido'
            case 'auth/user-disabled':
                return 'Esta cuenta ha sido deshabilitada'
            case 'auth/too-many-requests':
                return 'Demasiados intentos fallidos. Intenta más tarde'
            case 'auth/network-request-failed':
                return 'Error de conexión. Verifica tu internet'
            default:
                return 'Error al iniciar sesión. Intenta nuevamente'
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            await signIn(email, password)
            navigate('/dashboard')
        } catch (err: any) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setError(null)
        setLoading(true)

        try {
            const user = await signInWithGoogle()

            // Check if user has email
            if (!user.email) {
                setError('No se pudo obtener el email del usuario')
                return
            }

            // Check if user exists in MongoDB
            try {
                const users = await userService.getAll()
                const mongoUser = users.find((u) => u.email === user.email)

                if (mongoUser) {
                    // User exists, store ID and go to dashboard
                    localStorage.setItem('mongoUserId', mongoUser._id)
                    navigate('/dashboard')
                } else {
                    // New user, redirect to complete profile
                    navigate('/complete-profile', {
                        state: {
                            email: user.email,
                            nombre:
                                user.displayName || user.email.split('@')[0],
                        },
                    })
                }
            } catch (err) {
                // If can't fetch users, assume new user
                navigate('/complete-profile', {
                    state: {
                        email: user.email,
                        nombre: user.displayName || user.email.split('@')[0],
                    },
                })
            }
        } catch (err: any) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Branding (hidden on mobile) */}
            <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-purple-600 to-purple-800 p-12 flex-col justify-center items-center text-white">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold mb-6">
                        💊 Sistema de Gestión Médica
                    </h1>
                    <p className="text-xl opacity-90 mb-12">
                        Administra tratamientos, pastillas y usuarios de forma
                        eficiente y segura
                    </p>
                    <div className="flex gap-8 justify-center">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🔒</div>
                            <p className="text-sm">Seguro</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-2">⚡</div>
                            <p className="text-sm">Rápido</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-2">📊</div>
                            <p className="text-sm">Completo</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Iniciar Sesión
                        </h2>
                        <p className="text-gray-600">
                            Ingresa tus credenciales para continuar
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
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="nombre@ejemplo.com"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="Ingresa tu contraseña"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all disabled:bg-gray-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500 font-medium">
                            O continúa con
                        </span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full py-3 px-4 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-blue-50 hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-sm"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continuar con Google
                    </button>

                    <p className="mt-8 text-center text-gray-600">
                        ¿No tienes una cuenta?{' '}
                        <Link
                            to="/register"
                            className="text-purple-600 font-semibold hover:text-purple-800 transition-colors"
                        >
                            Regístrate gratis
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
