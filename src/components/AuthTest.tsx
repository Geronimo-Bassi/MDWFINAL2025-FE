import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function AuthTest() {
    const { user, loading, signUp, signIn, signInWithGoogle, signOut } =
        useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        try {
            await signUp(email, password)
            setSuccess('✅ Usuario registrado exitosamente')
            setEmail('')
            setPassword('')
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        try {
            await signIn(email, password)
            setSuccess('✅ Sesión iniciada exitosamente')
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleGoogleSignIn = async () => {
        setError(null)
        setSuccess(null)
        try {
            await signInWithGoogle()
            setSuccess('✅ Sesión iniciada con Google')
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleSignOut = async () => {
        setError(null)
        setSuccess(null)
        try {
            await signOut()
            setSuccess('✅ Sesión cerrada')
        } catch (err: any) {
            setError(err.message)
        }
    }

    if (loading) {
        return <div style={{ padding: '20px' }}>⏳ Cargando...</div>
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>🔐 Prueba de Autenticación Firebase</h1>

            {/* Mensajes */}
            {error && (
                <div
                    style={{
                        padding: '10px',
                        background: '#ffebee',
                        color: '#c62828',
                        borderRadius: '4px',
                        marginBottom: '10px',
                    }}
                >
                    ❌ {error}
                </div>
            )}
            {success && (
                <div
                    style={{
                        padding: '10px',
                        background: '#e8f5e9',
                        color: '#2e7d32',
                        borderRadius: '4px',
                        marginBottom: '10px',
                    }}
                >
                    {success}
                </div>
            )}

            {/* Estado del usuario */}
            <div
                style={{
                    padding: '15px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <h3>Estado actual:</h3>
                {user ? (
                    <div>
                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                            <strong>UID:</strong> {user.uid}
                        </p>
                        <button
                            onClick={handleSignOut}
                            style={{
                                padding: '10px 20px',
                                background: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            🚪 Cerrar Sesión
                        </button>
                    </div>
                ) : (
                    <p>No hay usuario autenticado</p>
                )}
            </div>

            {/* Formularios solo si no hay usuario */}
            {!user && (
                <>
                    {/* Formulario de registro */}
                    <div
                        style={{
                            padding: '15px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            marginBottom: '20px',
                        }}
                    >
                        <h2>📝 Registrarse</h2>
                        <form onSubmit={handleSignUp}>
                            <div style={{ marginBottom: '10px' }}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <input
                                    type="password"
                                    placeholder="Password (mínimo 6 caracteres)"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    minLength={6}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                style={{
                                    padding: '10px 20px',
                                    background: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    width: '100%',
                                }}
                            >
                                ➕ Registrarse
                            </button>
                        </form>
                    </div>

                    {/* Formulario de login */}
                    <div
                        style={{
                            padding: '15px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            marginBottom: '20px',
                        }}
                    >
                        <h2>🔑 Iniciar Sesión</h2>
                        <form onSubmit={handleSignIn}>
                            <div style={{ marginBottom: '10px' }}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                style={{
                                    padding: '10px 20px',
                                    background: '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    width: '100%',
                                }}
                            >
                                🔓 Iniciar Sesión
                            </button>
                        </form>
                    </div>

                    {/* Login con Google */}
                    <div
                        style={{
                            padding: '15px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                        }}
                    >
                        <h2>🌐 Otras opciones</h2>
                        <button
                            onClick={handleGoogleSignIn}
                            style={{
                                padding: '10px 20px',
                                background: '#DB4437',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                width: '100%',
                            }}
                        >
                            🔴 Iniciar sesión con Google
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default AuthTest
