import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/user.service'
import { DatePicker } from '../components/DatePicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

function Registro() {
    const navigate = useNavigate()
    const { signUp } = useAuth()
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        fechaNacimiento: '',
        telefono: '',
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

        if (!formData.fechaNacimiento) {
            setError('La fecha de nacimiento es obligatoria')
            return
        }

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
                telefono: formData.telefono || undefined,
            })

            // 3. Store MongoDB user ID in localStorage
            localStorage.setItem('mongoUserId', mongoUser._id)

            navigate('/panel')
        } catch (err: any) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden py-10">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Main content */}
            <div className="w-full max-w-md px-6 relative z-10">
                {/* Logo and branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-4 shadow-lg p-2">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        PillApp
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Crea tu cuenta y comienza a gestionar tratamientos de
                        manera profesional
                    </p>
                </div>

                {/* Register Card */}
                <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/80">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl font-bold text-center">
                            Crear Cuenta
                        </CardTitle>
                        <CardDescription className="text-center">
                            Completa el formulario para comenzar
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert
                                variant="destructive"
                                className="animate-in fade-in slide-in-from-top-2"
                            >
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="nombre"
                                        className="text-sm font-medium"
                                    >
                                        Nombre
                                    </Label>
                                    <Input
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        placeholder="Tu nombre"
                                        className="h-11 transition-all duration-200 focus:scale-[1.01]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="apellido"
                                        className="text-sm font-medium"
                                    >
                                        Apellido
                                    </Label>
                                    <Input
                                        id="apellido"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        placeholder="Tu apellido"
                                        className="h-11 transition-all duration-200 focus:scale-[1.01]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Fecha de Nacimiento
                                </Label>
                                <div>
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
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium"
                                >
                                    Correo Electrónico
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    placeholder="nombre@ejemplo.com"
                                    className="h-11 transition-all duration-200 focus:scale-[1.01]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="telefono"
                                    className="text-sm font-medium"
                                >
                                    Teléfono (WhatsApp){' '}
                                    <span className="text-gray-400 text-xs font-normal">
                                        (Opcional)
                                    </span>
                                </Label>
                                <Input
                                    id="telefono"
                                    name="telefono"
                                    type="tel"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="+5491112345678"
                                    className="h-11 transition-all duration-200 focus:scale-[1.01]"
                                />
                                <p className="text-[10px] text-gray-500 mt-1">
                                    📱 Formato internacional: +[código
                                    país][número]
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium"
                                >
                                    Contraseña
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    placeholder="Mínimo 6 caracteres"
                                    className="h-11 transition-all duration-200 focus:scale-[1.01]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="confirmPassword"
                                    className="text-sm font-medium"
                                >
                                    Confirmar Contraseña
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    placeholder="Repite tu contraseña"
                                    className="h-11 transition-all duration-200 focus:scale-[1.01]"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] mt-4"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creando cuenta...
                                    </div>
                                ) : (
                                    'Crear Cuenta'
                                )}
                            </Button>
                        </form>

                        <div className="pt-4 text-center">
                            <p className="text-sm text-gray-600">
                                ¿Ya tienes una cuenta?{' '}
                                <Link
                                    to="/iniciar-sesion"
                                    className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-blue-700 transition-all"
                                >
                                    Inicia sesión aquí
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <style>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    )
}

export default Registro
