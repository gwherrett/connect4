import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'

interface IconProps extends LucideProps {
  icon: ComponentType<LucideProps>
}

export function Icon({ icon: LucideIcon, size = 20, ...props }: IconProps) {
  return <LucideIcon size={size} {...props} />
}
