# 💊 Sistema de Gestión de Tratamientos Médicos

Aplicación web para gestionar tratamientos médicos con autenticación Firebase y almacenamiento en MongoDB.

## � Links

- **Frontend**: [Agregar URL de Vercel]
- **Backend**: [Agregar URL de API]
- **Repo Backend**: [Agregar URL del repositorio]

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript + Vite
- **Estado**: Redux Toolkit
- **Routing**: React Router DOM
- **Auth**: Firebase Authentication
- **HTTP**: Axios
- **Forms**: React Hook Form
- **Styles**: Tailwind CSS + Shadcn UI
- **Validación**: Joi

## 📁 Estructura

```
src/
├── components/       # Componentes reutilizables
├── pages/           # Vistas (Home, Login, Dashboard)
├── store/           # Redux (store, slices)
├── services/        # API calls
├── context/         # AuthContext
├── config/          # Firebase config
└── lib/             # Axios instance


## 🔐 Autenticación

- Email/Password
- Google Sign-In
- Token JWT en cada petición (Axios interceptor)
- Rutas protegidas con ProtectedRoute

## 🗺️ Rutas

**Públicas**: `/`, `/login`, `/register`
**Privadas**: `/dashboard` (requiere auth)

## 🔄 Redux

**Slice**: `tratamientoSlice`

- State: `items`, `loading`, `error`
- Thunks: `fetchTratamientos`, `createTratamiento`, `updateTratamiento`, `deleteTratamiento`

## 📡 API

Axios configurado con:

- Base URL al backend
- Interceptor que agrega token automáticamente
- Manejo global de errores

## Deploy en Vercel

1. Importar repo en Vercel
2. Agregar variables de entorno (las mismas del `.env.local`)
3. Deploy automático en cada push

## ✅ Funcionalidades

- [x] Registro y login (email/password + Google)
- [x] CRUD completo de tratamientos
- [x] Baja lógica y física
- [x] Modal de confirmación al eliminar
- [x] Validaciones frontend y backend
- [x] Rutas protegidas
- [x] Estado global con Redux
- [x] Diseño responsive
- [x] Notificaciones toast


**Proyecto Final - Metodologías de Desarrollo Web 2025**
```
