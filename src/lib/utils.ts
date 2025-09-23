import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

export function getMatchStatus(status: string, elapsed?: number): string {
  switch (status) {
    case 'NS':
      return 'Not Started'
    case '1H':
      return `${elapsed}'`
    case 'HT':
      return 'Half Time'
    case '2H':
      return `${elapsed}'`
    case 'FT':
      return 'Full Time'
    case 'AET':
      return 'Extra Time'
    case 'PEN':
      return 'Penalties'
    case 'SUSP':
      return 'Suspended'
    case 'CANC':
      return 'Cancelled'
    default:
      return status
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case '1H':
    case '2H':
      return 'text-green-500'
    case 'HT':
      return 'text-yellow-500'
    case 'FT':
      return 'text-muted-foreground'
    case 'NS':
      return 'text-blue-500'
    case 'SUSP':
    case 'CANC':
      return 'text-red-500'
    default:
      return 'text-muted-foreground'
  }
}
