'use client'

interface WhyWeAskToggleProps {
  copy: string
}

export function WhyWeAskToggle({ copy }: WhyWeAskToggleProps) {
  return (
    <p className="mt-3 text-xs font-body text-neutral-400 italic leading-relaxed">
      {copy}
    </p>
  )
}
