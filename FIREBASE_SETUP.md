# Firebase Configuration Guide

## 🔑 Obtener Credenciales de Firebase

Antes de continuar, necesitas obtener las credenciales de tu proyecto Firebase:

### Paso 1: Ir a Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto (o crea uno nuevo si no tienes)

### Paso 2: Configurar Authentication

1. En el menú lateral, haz clic en **"Authentication"**
2. Haz clic en **"Get Started"**
3. Habilita los métodos de autenticación que quieras:
    - **Email/Password** (recomendado para empezar)
    - **Google** (opcional)

### Paso 3: Obtener Credenciales

1. Haz clic en el ícono de engranaje ⚙️ (configuración del proyecto)
2. Ve a **"Project settings"**
3. Baja hasta la sección **"Your apps"**
4. Si no tienes una app web, haz clic en **"</>"** (Web)
5. Registra tu app con un nombre (ej: "MDWFINAL2025-FE")
6. Copia las credenciales que aparecen

### Paso 4: Copiar Credenciales

Verás algo como esto:

```javascript
const firebaseConfig = {
    apiKey: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    authDomain: 'tu-proyecto.firebaseapp.com',
    projectId: 'tu-proyecto',
    storageBucket: 'tu-proyecto.appspot.com',
    messagingSenderId: '123456789012',
    appId: '1:123456789012:web:abcdef123456',
}
```

**Copia estos valores**, los necesitarás para el siguiente paso.

---

## 📝 Siguiente Paso

Una vez que tengas las credenciales, dime y te ayudo a crear el archivo de configuración.
