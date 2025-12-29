import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '../config/firebase.config'

// Servicio de autenticación con Firebase
export const authService = {
    // Registrar nuevo usuario con email y password
    async signUpWithEmail(email: string, password: string): Promise<User> {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )
        return userCredential.user
    },

    // Iniciar sesión con email y password
    async signInWithEmail(email: string, password: string): Promise<User> {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        )
        return userCredential.user
    },

    // Iniciar sesión con Google
    async signInWithGoogle(): Promise<User> {
        const provider = new GoogleAuthProvider()
        const userCredential = await signInWithPopup(auth, provider)
        return userCredential.user
    },

    // Cerrar sesión
    async signOut(): Promise<void> {
        await firebaseSignOut(auth)
    },

    // Obtener usuario actual
    getCurrentUser(): User | null {
        return auth.currentUser
    },

    // Obtener token de autenticación (para enviar al backend)
    async getIdToken(): Promise<string | null> {
        const user = auth.currentUser
        if (!user) return null
        return await user.getIdToken()
    },

    // Refrescar token
    async refreshToken(): Promise<string | null> {
        const user = auth.currentUser
        if (!user) return null
        return await user.getIdToken(true) // true = force refresh
    },
}
