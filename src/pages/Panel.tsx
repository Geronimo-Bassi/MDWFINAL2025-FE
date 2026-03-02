import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useToast } from '../hooks/use-toast'
import { es } from 'date-fns/locale'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { pastillaService } from '../services/pastilla.service'
import { tratamientoService } from '../services/tratamiento.service'
import { userService } from '../services/user.service'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
    fetchTratamientosByUsuario,
    createTratamiento as createTratamientoAction,
    updateTratamiento as updateTratamientoAction,
    cancelTratamiento as cancelTratamientoAction,
} from '../store/slices/tratamientoSlice'
import type {
    Pastilla,
    User as DbUser,
    Tratamiento,
} from '../types/models.types'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Calendar } from '../components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../components/ui/popover'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../components/ui/command'
import { Badge } from '../components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import {
    CalendarIcon,
    Check,
    ChevronsUpDown,
    Clock,
    Pill,
    Activity,
    Calendar as CalendarLucide,
    ArrowRight,
    Edit2,
    Trash2,
    Pause,
} from 'lucide-react'
import { cn } from '../lib/utils'

function Panel() {
    const { user, signOut } = useAuth()
    const { toast } = useToast()
    const navigate = useNavigate()

    // Redux hooks
    const dispatch = useAppDispatch()
    const {
        tratamientos,
        loading: loadingTratamientos,
        error: errorTratamientos,
    } = useAppSelector((state) => state.tratamientos)

    type CreateFormData = {
        nombre: string
        selectedPastilla: string
        dosis: string
        frecuencia: string
        horaInicio: string
        fechaInicio: Date | undefined
        fechaFin: Date | undefined
    }

    const { register, handleSubmit, watch, setValue, reset } =
        useForm<CreateFormData>({
            defaultValues: {
                nombre: '',
                selectedPastilla: '',
                dosis: '',
                frecuencia: '',
                horaInicio: '08:00',
                fechaInicio: undefined,
                fechaFin: undefined,
            },
        })

    const watchFrecuencia = watch('frecuencia')
    const watchHoraInicio = watch('horaInicio')
    const watchSelectedPastilla = watch('selectedPastilla')
    const watchFechaInicio = watch('fechaInicio')
    const watchFechaFin = watch('fechaFin')

    const [openCombobox, setOpenCombobox] = useState(false)
    const [pastillas, setPastillas] = useState<Pastilla[]>([])
    const [loadingPastillas, setLoadingPastillas] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [dbUser, setDbUser] = useState<DbUser | null>(null)

    // Estado para edición
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingTratamiento, setEditingTratamiento] =
        useState<Tratamiento | null>(null)
    const [editNombre, setEditNombre] = useState('')
    const [editDosis, setEditDosis] = useState('')
    const [editFrecuencia, setEditFrecuencia] = useState('')
    const [editHoraInicio, setEditHoraInicio] = useState('08:00')
    const [editFechaInicio, setEditFechaInicio] = useState<Date>()
    const [editFechaFin, setEditFechaFin] = useState<Date>()

    // Cargar pastillas desde la API
    useEffect(() => {
        const fetchPastillas = async () => {
            try {
                setLoadingPastillas(true)
                const data = await pastillaService.getAll()
                setPastillas(data)
            } catch (error) {
                console.error('Error al cargar pastillas:', error)
                setPastillas([])
            } finally {
                setLoadingPastillas(false)
            }
        }

        fetchPastillas()
    }, [])

    // Cargar usuario de la base de datos
    useEffect(() => {
        const fetchDbUser = async () => {
            if (!user?.email) return

            try {
                const users = await userService.getAll()
                const foundUser = users.find((u) => u.email === user.email)
                if (foundUser) {
                    setDbUser(foundUser)
                } else {
                    console.error(
                        'Usuario no encontrado en la base de datos:',
                        user.email,
                    )
                }
            } catch (error) {
                console.error('Error crítico al cargar usuario:', error)
            }
        }

        fetchDbUser()
    }, [user])

    // Cargar tratamientos del usuario
    useEffect(() => {
        if (dbUser?._id) {
            dispatch(fetchTratamientosByUsuario(dbUser._id))
        }
    }, [dbUser?._id, dispatch])

    // Calcular vista previa de horarios
    const calculateSchedulePreview = () => {
        const freq = parseInt(watchFrecuencia)
        if (!freq || freq < 1 || freq > 24 || !watchHoraInicio) return []

        const intervalo = 24 / freq
        const [horaInicial, minutoInicial] = watchHoraInicio
            .split(':')
            .map(Number)
        const horarios: string[] = []

        for (let i = 0; i < freq; i++) {
            const totalMinutos =
                horaInicial * 60 + minutoInicial + i * intervalo * 60
            const hora = Math.floor(totalMinutos / 60) % 24
            const minuto = Math.floor(totalMinutos % 60)
            horarios.push(
                `${String(hora).padStart(2, '0')}:${String(minuto).padStart(
                    2,
                    '0',
                )}`,
            )
        }

        return horarios
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/iniciar-sesion')
    }

    const handleCreateTratamiento = async (data: CreateFormData) => {
        if (!dbUser?._id) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description:
                    'No se pudo obtener el ID del usuario. Por favor recarga la página.',
            })
            return
        }

        try {
            setIsCreating(true)

            const tratamientoData = {
                nombre: data.nombre.trim(),
                usuarioId: dbUser._id,
                pastillaId: data.selectedPastilla,
                dosis: data.dosis.trim(),
                frecuencia: parseInt(data.frecuencia),
                horaInicio: data.horaInicio,
                fechaInicio: data.fechaInicio!.toISOString(),
                fechaFin: data.fechaFin?.toISOString(),
            }

            await dispatch(createTratamientoAction(tratamientoData)).unwrap()

            reset() // Limpiar formulario

            toast({
                title: 'Éxito',
                description: 'Tratamiento creado exitosamente',
            })
        } catch (error: any) {
            console.error('Error crítico al crear tratamiento:', error)
            const errorMessage =
                error?.message ||
                error?.toString() ||
                'Error al crear tratamiento'
            toast({
                variant: 'destructive',
                title: 'Error',
                description: errorMessage,
            })
        } finally {
            setIsCreating(false)
        }
    }

    const handleCancelTratamiento = async (id: string) => {
        if (
            !confirm('¿Estás seguro de que deseas cancelar este tratamiento?')
        ) {
            return
        }

        try {
            await dispatch(cancelTratamientoAction(id)).unwrap()
            toast({
                title: 'Éxito',
                description: 'Tratamiento cancelado correctamente',
            })
        } catch (error) {
            console.error('Error al cancelar tratamiento:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudo cancelar el tratamiento',
            })
        }
    }

    const handleFinalizarTratamiento = async (id: string) => {
        if (
            !confirm('¿Estás seguro de que deseas finalizar este tratamiento?')
        ) {
            return
        }

        try {
            await tratamientoService.updateEstado(id, 'finalizado')
            // Recargar tratamientos
            if (dbUser?._id) {
                dispatch(fetchTratamientosByUsuario(dbUser._id))
            }
            toast({
                title: 'Éxito',
                description: 'Tratamiento finalizado correctamente',
            })
        } catch (error) {
            console.error('Error al finalizar tratamiento:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudo finalizar el tratamiento',
            })
        }
    }

    const handleSuspenderTratamiento = async (id: string) => {
        if (
            !confirm('¿Estás seguro de que deseas suspender este tratamiento?')
        ) {
            return
        }

        try {
            await tratamientoService.updateEstado(id, 'suspendido')
            // Recargar tratamientos
            if (dbUser?._id) {
                dispatch(fetchTratamientosByUsuario(dbUser._id))
            }
            toast({
                title: 'Éxito',
                description: 'Tratamiento suspendido correctamente',
            })
        } catch (error) {
            console.error('Error al suspender tratamiento:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudo suspender el tratamiento',
            })
        }
    }

    const handleEditTratamiento = (tratamiento: Tratamiento) => {
        setEditingTratamiento(tratamiento)
        setEditNombre(tratamiento.nombre)
        setEditDosis(tratamiento.dosis)
        setEditFrecuencia(tratamiento.frecuencia.toString())
        setEditHoraInicio(tratamiento.horaInicio)
        setEditFechaInicio(new Date(tratamiento.fechaInicio))
        if (tratamiento.fechaFin) {
            setEditFechaFin(new Date(tratamiento.fechaFin))
        } else {
            setEditFechaFin(undefined)
        }
        setIsEditDialogOpen(true)
    }

    const handleUpdateTratamiento = async () => {
        if (!editingTratamiento) return

        // Validaciones similares a la creación
        if (!editNombre.trim()) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Por favor ingresa el nombre del tratamiento',
            })
            return
        }
        if (!editDosis.trim()) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Por favor ingresa la dosis',
            })
            return
        }
        // Validar que la dosis sea un número entero positivo
        const dosisNum = parseInt(editDosis.trim())
        if (isNaN(dosisNum) || dosisNum <= 0 || !Number.isInteger(dosisNum)) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'La dosis debe ser un número entero positivo',
            })
            return
        }
        const freq = parseInt(editFrecuencia)
        if (!freq || freq < 1 || freq > 24) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'La frecuencia debe estar entre 1 y 24',
            })
            return
        }
        if (!editFechaInicio) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Por favor selecciona la fecha de inicio',
            })
            return
        }

        try {
            setIsCreating(true)
            const updateData = {
                nombre: editNombre.trim(),
                dosis: editDosis.trim(),
                frecuencia: freq,
                horaInicio: editHoraInicio,
                fechaInicio: editFechaInicio.toISOString(),
                fechaFin: editFechaFin?.toISOString(),
            }

            await dispatch(
                updateTratamientoAction({
                    id: editingTratamiento._id,
                    data: updateData,
                }),
            ).unwrap()

            setIsEditDialogOpen(false)
            toast({
                title: 'Éxito',
                description: 'Tratamiento actualizado correctamente',
            })
        } catch (error: any) {
            console.error('Error al actualizar tratamiento:', error)
            const errorMessage = error || 'Error al actualizar'
            toast({
                variant: 'destructive',
                title: 'Error',
                description: errorMessage,
            })
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className="flex min-h-screen">
            {/* MENÚ LATERAL - Izquierda */}
            <Sidebar onSignOut={handleSignOut} />

            {/* ÁREA PRINCIPAL - Derecha */}
            <div className="flex-1 p-4 md:p-8 lg:p-10 bg-gray-50 min-h-screen">
                {/* Contenedor responsive: 1 columna en móvil, 2 columnas en desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Columna Izquierda: Formulario */}
                    <div>
                        <form onSubmit={handleSubmit(handleCreateTratamiento)}>
                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle>Crear Tratamiento</CardTitle>
                                    <CardDescription>
                                        Completa los datos del nuevo tratamiento
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nombre">
                                            Nombre del Tratamiento
                                        </Label>
                                        <Input
                                            id="nombre"
                                            placeholder="Ej: Tratamiento para dolor de cabeza"
                                            {...register('nombre', {
                                                required: true,
                                            })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Pastilla</Label>
                                        <Popover
                                            open={openCombobox}
                                            onOpenChange={setOpenCombobox}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openCombobox}
                                                    className="w-full justify-between"
                                                >
                                                    {loadingPastillas
                                                        ? 'Cargando pastillas...'
                                                        : watchSelectedPastilla
                                                          ? pastillas.find(
                                                                (pastilla) =>
                                                                    pastilla._id ===
                                                                    watchSelectedPastilla,
                                                            )?.nombre
                                                          : 'Selecciona una pastilla...'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Buscar pastilla..." />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            {loadingPastillas
                                                                ? 'Cargando...'
                                                                : pastillas.length ===
                                                                    0
                                                                  ? 'No hay pastillas disponibles'
                                                                  : 'No se encontró la pastilla.'}
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {pastillas.map(
                                                                (pastilla) => (
                                                                    <CommandItem
                                                                        key={
                                                                            pastilla._id
                                                                        }
                                                                        value={
                                                                            pastilla.nombre
                                                                        }
                                                                        onSelect={() => {
                                                                            const newValue =
                                                                                pastilla._id ===
                                                                                watchSelectedPastilla
                                                                                    ? ''
                                                                                    : pastilla._id
                                                                            setValue(
                                                                                'selectedPastilla',
                                                                                newValue,
                                                                                {
                                                                                    shouldValidate: true,
                                                                                },
                                                                            )
                                                                            setOpenCombobox(
                                                                                false,
                                                                            )
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                'mr-2 h-4 w-4',
                                                                                watchSelectedPastilla ===
                                                                                    pastilla._id
                                                                                    ? 'opacity-100'
                                                                                    : 'opacity-0',
                                                                            )}
                                                                        />
                                                                        {
                                                                            pastilla.nombre
                                                                        }
                                                                    </CommandItem>
                                                                ),
                                                            )}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="dosis">
                                            Dosis (mg)
                                        </Label>
                                        <Input
                                            id="dosis"
                                            type="number"
                                            min="1"
                                            step="1"
                                            placeholder="Ej: 500"
                                            {...register('dosis', {
                                                required: true,
                                            })}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Ingresa solo números enteros (ej:
                                            500)
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="frecuencia">
                                            Frecuencia (veces al día)
                                        </Label>
                                        <Input
                                            id="frecuencia"
                                            type="number"
                                            min="1"
                                            max="24"
                                            placeholder="Ej: 3"
                                            {...register('frecuencia', {
                                                required: true,
                                            })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="horaInicio">
                                            Hora de Inicio
                                        </Label>
                                        <Input
                                            id="horaInicio"
                                            type="time"
                                            {...register('horaInicio', {
                                                required: true,
                                            })}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Los horarios se calcularán
                                            automáticamente según la frecuencia
                                        </p>
                                    </div>

                                    {/* Vista previa de horarios */}
                                    {watchFrecuencia &&
                                        parseInt(watchFrecuencia) > 0 &&
                                        parseInt(watchFrecuencia) <= 24 && (
                                            <Alert className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                                                <Clock className="h-4 w-4 text-purple-600" />
                                                <AlertTitle className="text-purple-900">
                                                    Horarios programados
                                                </AlertTitle>
                                                <AlertDescription>
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {calculateSchedulePreview().map(
                                                            (hora, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="secondary"
                                                                    className="px-3 py-1.5 bg-white border border-purple-300 text-purple-700 hover:bg-purple-50"
                                                                >
                                                                    <Clock className="h-3 w-3 mr-1" />
                                                                    {hora}
                                                                </Badge>
                                                            ),
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-purple-600 mt-3">
                                                        Intervalo:{' '}
                                                        {watchFrecuencia &&
                                                            parseInt(
                                                                watchFrecuencia,
                                                            ) > 0 &&
                                                            `cada ${
                                                                24 /
                                                                parseInt(
                                                                    watchFrecuencia,
                                                                )
                                                            } horas`}
                                                    </p>
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                    <div className="space-y-2">
                                        <Label htmlFor="fechaInicio">
                                            Fecha de Inicio
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    type="button"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !watchFechaInicio &&
                                                            'text-muted-foreground',
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {watchFechaInicio ? (
                                                        format(
                                                            watchFechaInicio,
                                                            'PPP',
                                                            {
                                                                locale: es,
                                                            },
                                                        )
                                                    ) : (
                                                        <span>
                                                            Selecciona una fecha
                                                        </span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={watchFechaInicio}
                                                    onSelect={(val) =>
                                                        setValue(
                                                            'fechaInicio',
                                                            val,
                                                            {
                                                                shouldValidate: true,
                                                            },
                                                        )
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fechaFin">
                                            Fecha de Fin
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    type="button"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !watchFechaFin &&
                                                            'text-muted-foreground',
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {watchFechaFin ? (
                                                        format(
                                                            watchFechaFin,
                                                            'PPP',
                                                            {
                                                                locale: es,
                                                            },
                                                        )
                                                    ) : (
                                                        <span>
                                                            Selecciona una fecha
                                                        </span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={watchFechaFin}
                                                    onSelect={(val) =>
                                                        setValue(
                                                            'fechaFin',
                                                            val,
                                                            {
                                                                shouldValidate: true,
                                                            },
                                                        )
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="submit"
                                        className="w-full bg-[#667eea] hover:bg-[#5568d3] text-white"
                                        disabled={isCreating}
                                    >
                                        {isCreating
                                            ? 'Creando...'
                                            : 'Crear Tratamiento'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </div>

                    {/* Columna Derecha: Tratamientos Activos */}
                    <div>
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Tratamientos Activos</CardTitle>
                                <CardDescription>
                                    Tus tratamientos en curso
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loadingTratamientos ? (
                                    <p className="text-center text-gray-500 py-8">
                                        Cargando tratamientos...
                                    </p>
                                ) : errorTratamientos ? (
                                    <p className="text-center text-red-500 py-8">
                                        Error: {errorTratamientos}
                                    </p>
                                ) : tratamientos.filter(
                                      (t) => t.estado === 'activo',
                                  ).length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">
                                        No tienes tratamientos activos
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {tratamientos
                                            .filter(
                                                (t) => t.estado === 'activo',
                                            )
                                            .map((tratamiento) => (
                                                <div
                                                    key={tratamiento._id}
                                                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-lg text-indigo-900">
                                                                {
                                                                    tratamiento.nombre
                                                                }
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                {typeof tratamiento.pastilla ===
                                                                'string'
                                                                    ? 'Pastilla'
                                                                    : tratamiento
                                                                          .pastilla
                                                                          .nombre}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                onClick={() =>
                                                                    handleEditTratamiento(
                                                                        tratamiento,
                                                                    )
                                                                }
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                onClick={() =>
                                                                    handleFinalizarTratamiento(
                                                                        tratamiento._id,
                                                                    )
                                                                }
                                                                title="Finalizar tratamiento"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                                onClick={() =>
                                                                    handleSuspenderTratamiento(
                                                                        tratamiento._id,
                                                                    )
                                                                }
                                                                title="Suspender tratamiento"
                                                            >
                                                                <Pause className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                onClick={() =>
                                                                    handleCancelTratamiento(
                                                                        tratamiento._id,
                                                                    )
                                                                }
                                                                title="Cancelar tratamiento"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 space-y-2">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Pill className="h-4 w-4 mr-2 text-purple-500" />
                                                            <span className="font-medium mr-1">
                                                                Dosis:
                                                            </span>{' '}
                                                            {tratamiento.dosis}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Activity className="h-4 w-4 mr-2 text-blue-500" />
                                                            <span className="font-medium mr-1">
                                                                Frecuencia:
                                                            </span>{' '}
                                                            {
                                                                tratamiento.frecuencia
                                                            }
                                                            x al día
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                                                            <span className="font-medium mr-1">
                                                                Hora inicio:
                                                            </span>{' '}
                                                            {
                                                                tratamiento.horaInicio
                                                            }
                                                        </div>

                                                        <div className="flex items-center text-sm text-gray-600 pt-1">
                                                            <CalendarLucide className="h-4 w-4 mr-2 text-emerald-500" />
                                                            <span className="font-medium mr-1">
                                                                Periodo:
                                                            </span>
                                                            {format(
                                                                new Date(
                                                                    tratamiento.fechaInicio,
                                                                ),
                                                                'd MMM yy',
                                                                { locale: es },
                                                            )}
                                                            {tratamiento.fechaFin && (
                                                                <>
                                                                    <ArrowRight className="h-3 w-3 mx-2" />
                                                                    {format(
                                                                        new Date(
                                                                            tratamiento.fechaFin,
                                                                        ),
                                                                        'd MMM yy',
                                                                        {
                                                                            locale: es,
                                                                        },
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>

                                                        {tratamiento.horarios &&
                                                            tratamiento.horarios
                                                                .length > 0 && (
                                                                <div className="mt-3 flex flex-wrap gap-1.5">
                                                                    {tratamiento.horarios.map(
                                                                        (
                                                                            horario,
                                                                            idx,
                                                                        ) => (
                                                                            <Badge
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                variant={
                                                                                    horario.tomado
                                                                                        ? 'default'
                                                                                        : 'secondary'
                                                                                }
                                                                                className="text-[10px] px-2 py-0"
                                                                            >
                                                                                {
                                                                                    horario.hora
                                                                                }
                                                                            </Badge>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modal de Edición */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Editar Tratamiento</DialogTitle>
                        <DialogDescription>
                            Modifica los detalles del tratamiento para{' '}
                            <span className="font-semibold text-indigo-900">
                                {editingTratamiento &&
                                    (typeof editingTratamiento.pastilla ===
                                    'string'
                                        ? 'la pastilla'
                                        : editingTratamiento.pastilla.nombre)}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-nombre">
                                Nombre del Tratamiento
                            </Label>
                            <Input
                                id="edit-nombre"
                                placeholder="Ej: Tratamiento para dolor de cabeza"
                                value={editNombre}
                                onChange={(e) => setEditNombre(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-dosis">Dosis (mg)</Label>
                            <Input
                                id="edit-dosis"
                                type="number"
                                min="1"
                                step="1"
                                placeholder="Ej: 500"
                                value={editDosis}
                                onChange={(e) => {
                                    const value = e.target.value
                                    // Solo permitir números enteros
                                    if (value === '' || /^\d+$/.test(value)) {
                                        setEditDosis(value)
                                    }
                                }}
                            />
                            <p className="text-xs text-muted-foreground">
                                Ingresa solo números enteros (ej: 500)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-frecuencia">
                                Frecuencia (veces al día)
                            </Label>
                            <Input
                                id="edit-frecuencia"
                                type="number"
                                min="1"
                                max="24"
                                value={editFrecuencia}
                                onChange={(e) =>
                                    setEditFrecuencia(e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-horaInicio">
                                Hora de Inicio
                            </Label>
                            <Input
                                id="edit-horaInicio"
                                type="time"
                                value={editHoraInicio}
                                onChange={(e) =>
                                    setEditHoraInicio(e.target.value)
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Fecha de Inicio</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !editFechaInicio &&
                                                    'text-muted-foreground',
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {editFechaInicio ? (
                                                format(editFechaInicio, 'PPP', {
                                                    locale: es,
                                                })
                                            ) : (
                                                <span>Selecciona fecha</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={editFechaInicio}
                                            onSelect={setEditFechaInicio}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label>Fecha de Fin</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !editFechaFin &&
                                                    'text-muted-foreground',
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {editFechaFin ? (
                                                format(editFechaFin, 'PPP', {
                                                    locale: es,
                                                })
                                            ) : (
                                                <span>Sin fecha fin</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={editFechaFin}
                                            onSelect={setEditFechaFin}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={handleUpdateTratamiento}
                            disabled={isCreating}
                        >
                            {isCreating ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Panel
