import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface DatePickerProps {
    value?: string
    onChange: (date: string) => void
    disabled?: boolean
    placeholder?: string
    maxDate?: Date
    label?: string
}

export function DatePicker({
    value,
    onChange,
    disabled = false,
    placeholder = 'Selecciona una fecha',
    maxDate = new Date(),
    label,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false)
    const selectedDate = value ? new Date(value) : undefined

    const handleSelect = (date: Date | undefined) => {
        if (date) {
            // Convert to YYYY-MM-DD format
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            onChange(`${year}-${month}-${day}`)
            setOpen(false)
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className="w-full justify-between font-normal px-4 py-3 h-auto border-2 border-gray-200 rounded-xl hover:border-purple-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                >
                    {value ? (
                        format(new Date(value), "d 'de' MMMM 'de' yyyy", {
                            locale: es,
                        })
                    ) : (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
            >
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    captionLayout="dropdown"
                    onSelect={handleSelect}
                    disabled={(date) => date > maxDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
