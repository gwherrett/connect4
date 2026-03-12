'use client'

import type { ReactNode } from 'react'
import { ProgressBar } from './ProgressBar'
import { PhaseLabel } from './PhaseLabel'
import { ContinueButton } from './ContinueButton'
import { en } from '@/locales/en'

interface QuizLayoutProps {
  step:              number
  pip:               number    // which pip to show active (may differ from step for multi-Q screens)
  continueDisabled:  boolean
  onContinue:        () => void
  onBack:            () => void
  children:          ReactNode
}

export function QuizLayout({
  step,
  pip,
  continueDisabled,
  onContinue,
  onBack,
  children,
}: QuizLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Top bar */}
      <div className="px-5 pt-5 pb-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-body text-neutral-500 hover:text-neutral-800 transition-colors"
            aria-label={en.quiz.shared.backAriaLabel}
          >
            {en.quiz.shared.back}
          </button>
        </div>
        <ProgressBar currentStep={pip} />
        <PhaseLabel step={pip} />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-4 max-w-lg w-full mx-auto">
        {children}
      </div>

      {/* Continue button */}
      <div className="px-5 pb-8 max-w-lg w-full mx-auto">
        <ContinueButton
          step={step}
          disabled={continueDisabled}
          onClick={onContinue}
        />
      </div>
    </div>
  )
}
