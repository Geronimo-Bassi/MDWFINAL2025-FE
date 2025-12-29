// Tipos que coinciden con los modelos del backend

export interface User {
    _id: string
    nombre: string
    apellido: string
    email: string
    fechaNacimiento: string
    tratamientos?: string[]
    createdAt?: string
    updatedAt?: string
}

export interface Pastilla {
    _id: string
    nombre: string
    descripcion?: string
    dosis: string
    frecuencia: string
    createdAt?: string
    updatedAt?: string
}

export interface Tratamiento {
    _id: string
    nombre: string
    descripcion?: string
    fechaInicio: string
    fechaFin?: string
    pastillas: Pastilla[] | string[] // Puede ser array de IDs o poblado
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
}

export interface CreatePastillaDto {
    nombre: string
    descripcion?: string
    dosis: string
    frecuencia: string
}

export interface CreateTratamientoDto {
    nombre: string
    descripcion?: string
    fechaInicio: string
    fechaFin?: string
    pastillas: string[] // Array de IDs de pastillas
}
