import { MdHistory, MdPerson, MdLogout } from 'react-icons/md'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface SidebarProps {
    onSignOut: () => void
}

export default function Sidebar({ onSignOut }: SidebarProps) {
    return (
        <div className="w-16 md:w-60 lg:w-80 xl:w-96 bg-gray-50 min-h-screen flex flex-col border-r border-gray-200">
            {/* Header with Logo and App Name */}
            <div className="p-2 md:p-4 lg:p-6 flex items-center justify-center">
                <img
                    src="/logo.png"
                    alt="PillApp Logo"
                    className="w-8 h-8 md:w-16 md:h-16 lg:w-20 lg:h-20 md:mr-3"
                />
                <h1 className="hidden md:block text-xl lg:text-3xl xl:text-4xl font-bold text-purple-600">
                    PillApp
                </h1>
            </div>

            <Separator className="mb-6" />

            {/* Menu Section */}
            <nav className="flex-1 px-1 md:px-3 lg:px-4 space-y-2">
                <Button
                    variant="ghost"
                    className={cn(
                        'w-full justify-center md:justify-start text-xs md:text-sm lg:text-base font-medium h-auto py-2 md:py-3 lg:py-4 px-2 md:px-4 lg:px-6',
                        'hover:bg-purple-600 hover:text-white',
                        'transition-all duration-300 md:hover:translate-x-1',
                        'bg-gray-200 text-gray-900'
                    )}
                >
                    <MdHistory className="md:mr-2 lg:mr-3 h-5 w-5 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                    <span className="hidden md:inline">
                        Historial de Tratamientos
                    </span>
                </Button>

                <Button
                    variant="ghost"
                    className={cn(
                        'w-full justify-center md:justify-start text-xs md:text-sm lg:text-base font-medium h-auto py-2 md:py-3 lg:py-4 px-2 md:px-4 lg:px-6',
                        'hover:bg-purple-600 hover:text-white',
                        'transition-all duration-300 md:hover:translate-x-1',
                        'bg-gray-200 text-gray-900'
                    )}
                >
                    <MdPerson className="md:mr-2 lg:mr-3 h-5 w-5 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                    <span className="hidden md:inline">Mi Perfil</span>
                </Button>
            </nav>

            {/* Logout Button - at bottom */}
            <div className="p-1 md:p-3 lg:p-4 mt-auto">
                <Button
                    variant="ghost"
                    onClick={onSignOut}
                    className={cn(
                        'w-full justify-center md:justify-start text-xs md:text-sm lg:text-base font-medium h-auto py-2 md:py-3 lg:py-4 px-2 md:px-4 lg:px-6',
                        'hover:bg-red-500 hover:text-white',
                        'transition-all duration-300 md:hover:translate-x-1',
                        'bg-gray-200 text-gray-900'
                    )}
                >
                    <MdLogout className="md:mr-2 lg:mr-3 h-5 w-5 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                    <span className="hidden md:inline">Cerrar Sesión</span>
                </Button>
            </div>
        </div>
    )
}
