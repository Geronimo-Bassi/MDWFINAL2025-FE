import { MdHistory, MdPerson, MdLogout } from 'react-icons/md'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface SidebarProps {
    onSignOut: () => void
}

export default function Sidebar({ onSignOut }: SidebarProps) {
    return (
        <div className="w-[400px] bg-gray-50 min-h-screen flex flex-col border-r border-gray-200">
            {/* Header with Logo and App Name */}
            <div className="p-6 flex items-center justify-center">
                <img
                    src="/logo.png"
                    alt="PillApp Logo"
                    className="w-24 h-24 mr-4"
                />
                <h1 className="text-4xl font-bold text-purple-600">PillApp</h1>
            </div>

            <Separator className="mb-6" />

            {/* Menu Section */}
            <nav className="flex-1 px-4 space-y-2">
                <Button
                    variant="ghost"
                    className={cn(
                        'w-full justify-start text-lg font-medium h-auto py-4 px-6',
                        'hover:bg-purple-600 hover:text-white',
                        'transition-all duration-300 hover:translate-x-1',
                        'bg-gray-200 text-gray-900'
                    )}
                >
                    <MdHistory className="mr-3 h-6 w-6" />
                    Historial de Tratamientos
                </Button>

                <Button
                    variant="ghost"
                    className={cn(
                        'w-full justify-start text-lg font-medium h-auto py-4 px-6',
                        'hover:bg-purple-600 hover:text-white',
                        'transition-all duration-300 hover:translate-x-1',
                        'bg-gray-200 text-gray-900'
                    )}
                >
                    <MdPerson className="mr-3 h-6 w-6" />
                    Mi Perfil
                </Button>
            </nav>

            {/* Logout Button - at bottom */}
            <div className="p-4 mt-auto">
                <Button
                    variant="ghost"
                    onClick={onSignOut}
                    className={cn(
                        'w-full justify-start text-lg font-medium h-auto py-4 px-6',
                        'hover:bg-red-500 hover:text-white',
                        'transition-all duration-300 hover:translate-x-1',
                        'bg-gray-200 text-gray-900'
                    )}
                >
                    <MdLogout className="mr-3 h-6 w-6" />
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    )
}
