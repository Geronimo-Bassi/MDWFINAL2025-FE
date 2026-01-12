// Tipos que coinciden con los modelos del backend

export interface User {
    _id: string
    nombre: string
    apellido: string
    email: string
    fechaNacimiento: string
    telefono?: string // Número de WhatsApp en formato internacional
    tratamientos?: string[]
    createdAt?: string
    updatedAt?: string
}

export interface Pastilla {
    _id: string
    nombre: string
    descripcion?: string
    deletedAt?: string | null
    createdAt?: string
    updatedAt?: string
}

export interface Horario {
    hora: string // Formato HH:mm
    tomado: boolean
    ultimaToma?: string
}

export interface Tratamiento {
    _id: string
    usuario: string // ID del usuario
    pastilla: string | Pastilla // ID de la pastilla o pastilla poblada
    dosis: string
    frecuencia: number // veces al día
    horaInicio: string // Formato HH:mm (ej: "08:00")
    intervaloHoras: number // Calculado automáticamente
    horarios: Horario[] // Array de horarios generados automáticamente
    fechaInicio: string
    fechaFin?: string
    activo: boolean
    estado: 'activo' | 'finalizado' | 'suspendido' | 'cancelado'
    deletedAt?: string | null
    createdAt?: string
    updatedAt?: string
}

// Tipos para crear nuevos registros (sin _id ni timestamps)
export interface CreateUserDto {
    nombre: string
    apellido: string
    email: string
    fechaNacimiento: string
    telefono?: string // Opcional: número de WhatsApp
}

export interface CreatePastillaDto {
    nombre: string
    descripcion?: string
}

export interface CreateTratamientoDto {
    usuarioId: string // ID del usuario (backend espera 'usuarioId')
    pastillaId: string // ID de la pastilla (backend espera 'pastillaId')
    dosis: string
    frecuencia: number
    horaInicio: string // Formato HH:mm (ej: "08:00")
    fechaInicio: string
    fechaFin?: string
    activo?: boolean
    estado?: 'activo' | 'finalizado' | 'suspendido' | 'cancelado'
    // intervaloHoras y horarios se calculan automáticamente en el backend
}
