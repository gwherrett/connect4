'use client'

import type { ReactNode } from 'react'

interface ButtonProps {
  variant:    'primary' | 'secondary' | 'ghost' | 'danger'
  size?:      'sm' | 'md' | 'lg'
  disabled?:  boolean
  onClick?:   () => void
  children:   ReactNode
  type?:      'button' | 'submit'
  fullWidth?: boolean
  className?: string
}

const variantClasses: Record<ButtonProps['variant'], string> = {
  primary:
    'bg-apt-terra text-apt-cream hover:bg-apt-dark disabled:bg-apt-mid/30 disabled:text-apt-cream/50',
  secondary:
    'bg-apt-cream text-apt-dark border border-apt-mid/20 hover:bg-apt-terra-tint disabled:text-apt-mid/50 disabled:border-apt-mid/10',
  ghost:
    'bg-transparent text-apt-mid hover:text-apt-dark hover:bg-apt-terra-tint disabled:text-apt-mid/50',
  danger:
    'bg-error-500 text-white hover:opacity-90 disabled:opacity-40',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-sm px-3 py-2 rounded-btn',
  md: 'text-sm px-6 py-3 rounded-btn',
  lg: 'text-base px-6 py-4 rounded-btn',
}

export function Button({
  variant,
  size = 'md',
  disabled = false,
  onClick,
  children,
  type = 'button',
  fullWidth = false,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center font-body font-medium transition-colors duration-150',
        'disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}
