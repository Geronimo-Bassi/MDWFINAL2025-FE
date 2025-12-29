import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Firebase configuration loaded from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Debug: Verificar que las variables se cargaron
console.log('🔥 Firebase Config:', {
    apiKey: firebaseConfig.apiKey ? '✅ Loaded' : '❌ Missing',
    authDomain: firebaseConfig.authDomain ? '✅ Loaded' : '❌ Missing',
    projectId: firebaseConfig.projectId ? '✅ Loaded' : '❌ Missing',
})

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar Firebase Authentication
export const auth = getAuth(app)

// Exportar la app por si se necesita en otros lugares
export default app
