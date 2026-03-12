'use client'

import { TextArea } from '@/components/ui/TextArea'
import { en } from '@/locales/en'

interface EscapeHatchProps {
  active:     boolean
  onActivate: () => void
  value:      string
  onChange:   (text: string) => void
}

export function EscapeHatch({ active, onActivate, value, onChange }: EscapeHatchProps) {
  if (active) {
    return (
      <TextArea
        label={en.quiz.shared.escapeHatchLabel}
        value={value}
        onChange={onChange}
        placeholder={en.quiz.shared.escapeHatchPlaceholder}
        rows={3}
        className="mt-2"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={onActivate}
      className="
        w-full mt-2 py-3 px-4 rounded-md
        border border-dashed border-neutral-300
        text-neutral-400 text-sm font-body
        hover:border-neutral-400 hover:text-neutral-600
        transition-colors duration-150 text-left
      "
    >
      {en.quiz.shared.escapeHatch}
    </button>
  )
}
