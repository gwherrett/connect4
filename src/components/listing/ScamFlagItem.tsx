import { AlertTriangle } from 'lucide-react'

interface ScamFlagItemProps {
  label: string
}

export function ScamFlagItem({ label }: ScamFlagItemProps) {
  return (
    <li className="flex items-start gap-2">
      <AlertTriangle size={14} className="text-error-500 mt-0.5 shrink-0" />
      <span className="text-sm font-body text-apt-dark">{label}</span>
    </li>
  )
}
