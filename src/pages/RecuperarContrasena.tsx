import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
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
    CardFooter,
} from '@/components/ui/card'
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'

function RecuperarContrasena() {
    const { resetPassword } = useAuth()
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const getErrorMessage = (error: any): string => {
        const errorCode = error.code || ''

        switch (errorCode) {
            case 'auth/invalid-email':
                return 'El formato del email no es válido'
            case 'auth/user-not-found':
                return 'No hay un usuario registrado con este correo'
            case 'auth/missing-email':
                return 'Por favor, ingresa un correo electrónico'
            case 'auth/network-request-failed':
                return 'Error de conexión. Verifica tu internet'
            default:
                return 'Error al intentar enviar el correo. Intenta nuevamente'
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        if (!email.trim()) {
            setError('Por favor, ingresa tu correo electrónico')
            return
        }

        setLoading(true)

        try {
            await resetPassword(email)
            setSuccess(true)
        } catch (err: any) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
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
                </div>

                {/* Forgot Password Card */}
                <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/80">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl font-bold text-center">
                            Recuperar Contraseña
                        </CardTitle>
                        <CardDescription className="text-center">
                            Ingresa tu correo para recibir un enlace de
                            recuperación
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

                        {success && (
                            <Alert className="bg-green-50 text-green-700 border-green-200 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertDescription>
                                    Te hemos enviado un correo con instrucciones
                                    para restablecer tu contraseña. Por favor
                                    revisa tu bandeja de entrada (y carpeta de
                                    spam).
                                </AlertDescription>
                            </Alert>
                        )}

                        {!success && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium"
                                    >
                                        Correo Electrónico
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        disabled={loading}
                                        placeholder="nombre@ejemplo.com"
                                        className="h-11 transition-all duration-200 focus:scale-[1.01]"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading || !email}
                                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Enviando...
                                        </div>
                                    ) : (
                                        'Enviar enlace de recuperación'
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-center border-t py-4">
                        <Link
                            to="/iniciar-sesion"
                            className="flex items-center text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver al inicio de sesión
                        </Link>
                    </CardFooter>
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

export default RecuperarContrasena
