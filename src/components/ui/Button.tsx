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
    'bg-primary-500 text-white hover:bg-primary-700 disabled:bg-neutral-100 disabled:text-neutral-300',
  secondary:
    'bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 disabled:text-neutral-300 disabled:border-neutral-100',
  ghost:
    'bg-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 disabled:text-neutral-300',
  danger:
    'bg-error-500 text-white hover:opacity-90 disabled:opacity-40',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-sm px-3 py-2 rounded-sm',
  md: 'text-sm px-4 py-3 rounded-md',
  lg: 'text-base px-6 py-4 rounded-md',
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
        'inline-flex items-center justify-center font-body font-semibold transition-colors duration-150',
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
