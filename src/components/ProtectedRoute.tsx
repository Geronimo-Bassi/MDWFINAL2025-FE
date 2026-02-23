import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
    children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <div
                        style={{
                            fontSize: '48px',
                            marginBottom: '20px',
                            animation: 'spin 1s linear infinite',
                        }}
                    >
                        ⏳
                    </div>
                    <p style={{ fontSize: '18px' }}>Cargando...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/iniciar-sesion" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute
