import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '../config/firebase.config'
import { authService } from '../services/auth.service'

interface AuthContextType {
    user: User | null
    loading: boolean
    signUp: (email: string, password: string) => Promise<User>
    signIn: (email: string, password: string) => Promise<User>
    signInWithGoogle: () => Promise<User>
    signOut: () => Promise<void>
    getToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Escuchar cambios en el estado de autenticación
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)
        })

        // Cleanup subscription
        return unsubscribe
    }, [])

    const value: AuthContextType = {
        user,
        loading,
        signUp: authService.signUpWithEmail,
        signIn: authService.signInWithEmail,
        signInWithGoogle: authService.signInWithGoogle,
        signOut: authService.signOut,
        getToken: authService.getIdToken,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
