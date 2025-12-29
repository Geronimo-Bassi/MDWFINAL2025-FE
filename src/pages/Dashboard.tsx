import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* MENÚ LATERAL - Izquierda */}
            <div
                style={{
                    width: '300px',
                    background: '#f5f5f5',
                    padding: '40px 0',
                }}
            >
                <h2 style={{ marginBottom: '20px', color: '#333' }}>Menú</h2>
                {/* Opciones del menú */}
                <button
                    style={{
                        width: '100%',
                        padding: '15px 20px',
                        marginBottom: '10px',
                        background: 'white',
                        border: 'none',
                        borderRadius: '0',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.3s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#667eea'
                        e.currentTarget.style.color = 'white'
                        e.currentTarget.style.transform = 'translateX(5px)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white'
                        e.currentTarget.style.color = 'black'
                        e.currentTarget.style.transform = 'translateX(0)'
                    }}
                >
                    Historial de Tratamientos
                </button>

                <button
                    style={{
                        width: '100%',
                        padding: '15px 20px',
                        marginBottom: '10px',
                        background: 'white',
                        border: 'none',
                        borderRadius: '0',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.3s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#667eea'
                        e.currentTarget.style.color = 'white'
                        e.currentTarget.style.transform = 'translateX(5px)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white'
                        e.currentTarget.style.color = 'black'
                        e.currentTarget.style.transform = 'translateX(0)'
                    }}
                >
                    Mi Perfil
                </button>

                <button
                    onClick={handleSignOut}
                    style={{
                        width: '100%',
                        padding: '15px 20px',
                        marginBottom: '10px',
                        background: 'white',
                        border: 'none',
                        borderRadius: '0',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.3s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f44336'
                        e.currentTarget.style.color = 'white'
                        e.currentTarget.style.transform = 'translateX(5px)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white'
                        e.currentTarget.style.color = 'black'
                        e.currentTarget.style.transform = 'translateX(0)'
                    }}
                >
                    Cerrar Sesión
                </button>
            </div>

            {/* ÁREA PRINCIPAL - Derecha */}
            <div style={{ flex: 1, padding: '40px' }}>
                <h1>Dashboard</h1>

                {/* Aquí irán los tratamientos activos */}
                <div>
                    <h2>Tratamientos Activos</h2>
                    {/* Lista de tratamientos */}
                </div>

                {/* Botón para agregar */}
                <button>Nuevo Tratamiento</button>
            </div>
        </div>
    )
}

export default Dashboard
