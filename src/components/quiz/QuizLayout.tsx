'use client'

import type { ReactNode } from 'react'
import { ProgressBar } from './ProgressBar'
import { PhaseLabel } from './PhaseLabel'
import { ContinueButton } from './ContinueButton'
import { SidePanelLayout } from '@/components/layout/SidePanelLayout'
import { en } from '@/locales/en'

interface QuizLayoutProps {
  step:              number
  pip:               number    // which pip to show active (may differ from step for multi-Q screens)
  continueDisabled:  boolean
  onContinue:        () => void
  onBack:            () => void
  children:          ReactNode
}

const PHASE_CONTEXT: Record<number, { headline: string; body: string }> = {
  1:  { headline: "Why you're here matters", body: "Your reason for moving shapes what a neighbourhood needs to give you. Work, school, family, lifestyle — each one points somewhere different." },
  2:  { headline: "Practicalities first", body: "Timeline, household, bedrooms, budget. These tell us what has to be true before anything else matters." },
  4:  { headline: "Practicalities first", body: "Rent in Vancouver varies a lot by neighbourhood. Budget tells us which places are actually viable — not just technically possible." },
  6:  { headline: "How you get around shapes the whole map", body: "On transit, you need the SkyTrain close. Walking, you need density. A car gives you more range — but you're still choosing a home base." },
  7:  { headline: "Your lifestyle, not your commute", body: "How you spend a free day tells us more than your commute does. The rhythm of a neighbourhood — what's open, who's around, what there is to do — that's the thing that's hardest to change once you're in." },
  8:  { headline: "The energy you come home to", body: "The energy of a neighbourhood is the thing that's hardest to change and easiest to get wrong. It's also the hardest to research. Your answer here matters more than most." },
  10: { headline: "What comfort actually means", body: "Comfort means different things to different people. For some it's personal safety. For others it's knowing your neighbours, or feeling welcome as you are. Your answer shifts what we look for." },
  11: { headline: "Where you're from tells us a lot", body: "The neighbourhood you know shapes what feels normal. We use this to find Vancouver places with a similar feel — so your match isn't just a list of features, it's something you'd recognise." },
  12: { headline: "Describe it honestly", body: "Don't hold back. The more specific you are, the better the match. Texture, feel, energy — these tell us more than any amenity list." },
  13: { headline: "A place that just felt right", body: "A place you loved tells us something no checklist can. We're looking for what made it feel right — and finding where that exists in Vancouver." },
  14: { headline: "What makes it yours", body: "Energy, texture, the kind of people. The thing that's hard to put into words is exactly what we're trying to find." },
}

function QuizSidePanel({ pip }: { pip: number }) {
  const ctx = PHASE_CONTEXT[pip] ?? PHASE_CONTEXT[1]
  return (
    <div className="flex flex-col justify-between h-full px-10 py-12">
      <div>
        <p className="font-body text-xs font-semibold tracking-widest text-apt-mid uppercase mb-8">
          Why we ask
        </p>
        <h2 className="font-display text-2xl font-bold text-apt-cream leading-snug mb-4">
          {ctx.headline}
        </h2>
        <p className="font-body text-sm text-apt-mid leading-relaxed">
          {ctx.body}
        </p>
      </div>

      <div className="border-t border-apt-mid pt-8">
        <div className="flex gap-1 flex-wrap">
          {[1,2,3,4].map((phase) => {
            const active =
              (phase === 1 && pip <= 5) ||
              (phase === 2 && pip >= 6 && pip <= 10) ||
              (phase === 3 && pip >= 11 && pip <= 12) ||
              (phase === 4 && pip >= 13)
            return (
              <span
                key={phase}
                className={[
                  'font-body text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full',
                  active ? 'bg-apt-lime-tint text-apt-terra' : 'bg-apt-dark/40 text-apt-mid',
                ].join(' ')}
              >
                Phase {phase}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function QuizMain({
  step, pip, continueDisabled, onContinue, onBack, children,
}: QuizLayoutProps) {
  return (
    <div className="min-h-screen bg-apt-cream flex flex-col">
      {/* Top bar */}
      <div className="px-5 pt-5 pb-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-body text-apt-mid hover:text-apt-dark transition-colors"
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

export function QuizLayout(props: QuizLayoutProps) {
  return (
    <SidePanelLayout
      main={<QuizMain {...props} />}
      side={<QuizSidePanel pip={props.pip} />}
    />
  )
}
