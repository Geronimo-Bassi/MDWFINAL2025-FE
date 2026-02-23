import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from './components/ui/toaster'
import IniciarSesion from './pages/IniciarSesion'
import Registro from './pages/Registro'
import RecuperarContrasena from './pages/RecuperarContrasena'
import CompletarPerfil from './pages/CompletarPerfil'
import Panel from './pages/Panel'
import Historial from './pages/Historial'
import Perfil from './pages/Perfil'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/iniciar-sesion"
                            element={<IniciarSesion />}
                        />
                        <Route path="/registro" element={<Registro />} />
                        <Route
                            path="/recuperar-contrasena"
                            element={<RecuperarContrasena />}
                        />
                        <Route
                            path="/completar-perfil"
                            element={<CompletarPerfil />}
                        />
                        {/* Protected Routes */}
                        <Route
                            path="/panel"
                            element={
                                <ProtectedRoute>
                                    <Panel />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/historial"
                            element={
                                <ProtectedRoute>
                                    <Historial />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/perfil"
                            element={
                                <ProtectedRoute>
                                    <Perfil />
                                </ProtectedRoute>
                            }
                        />
                        {/* Root redirect */}
                        <Route
                            path="/"
                            element={<Navigate to="/iniciar-sesion" replace />}
                        />
                    </Routes>
                    <Toaster />
                </BrowserRouter>
            </AuthProvider>
        </Provider>
    )
}

export default App
