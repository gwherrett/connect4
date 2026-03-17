'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/context/SessionContext'
import { NeighbourhoodMatchCard } from '@/components/result/NeighbourhoodMatchCard'
import { MatchSignalPills } from '@/components/result/MatchSignalPills'
import { SecondaryMatchCard } from '@/components/result/SecondaryMatchCard'
import { SaveBottomSheet } from '@/components/modals/SaveBottomSheet'
import { SidePanelLayout } from '@/components/layout/SidePanelLayout'
import { Button } from '@/components/ui/Button'
import { computeMatchSignals } from '@/lib/matching'
import { en, t } from '@/locales/en'
import type { Neighbourhood } from '@/types'

function getAnalogousText(
  neighbourhood: Neighbourhood,
  city: string | null,
  hood: string | null
): string {
  if (city && hood) {
    const key = `${city}_${hood}`
    if (key in neighbourhood.analogousComparisons) {
      return neighbourhood.analogousComparisons[key]
    }
  }
  if (city) {
    const cityKey = Object.keys(neighbourhood.analogousComparisons).find(
      (k) => k.startsWith(city + '_')
    )
    if (cityKey) return neighbourhood.analogousComparisons[cityKey]
  }
  return neighbourhood.analogousComparisons['default'] ?? ''
}

export default function ResultPage() {
  const router = useRouter()
  const { matchedNeighbourhood, state, resetSession, topMatches } = useSession()
  const [saveOpen, setSaveOpen] = useState(false)

  if (!matchedNeighbourhood) {
    if (typeof window !== 'undefined') router.replace('/quiz/1')
    return null
  }

  const winnerScore    = topMatches[0]?.score ?? 100
  const runnerUps      = topMatches.slice(1)
  const winnerSignals  = computeMatchSignals(state, matchedNeighbourhood)
  const analogousText  = getAnalogousText(
    matchedNeighbourhood,
    state.currentCity,
    state.currentNeighbourhood
  )

  const main = (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-lg mx-auto px-5 py-8">

        {/* Primary match card */}
        <NeighbourhoodMatchCard
          neighbourhood={matchedNeighbourhood}
          score={winnerScore}
          version={state.cardVersion}
          analogousText={analogousText}
        />

        {/* Match/gap pills for primary */}
        <div className="mt-5">
          <MatchSignalPills
            matches={winnerSignals.matches}
            gaps={winnerSignals.gaps}
          />
        </div>

        {/* Actions — mobile only */}
        <div className="mt-6 space-y-3 lg:hidden">
          <Button
            variant="primary"
            fullWidth
            onClick={() => router.push('/result/listing')}
          >
            {t('result.rentalEntry', { neighbourhood: matchedNeighbourhood.name })}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setSaveOpen(true)}
          >
            {en.result.saveButton}
          </Button>
          <button
            type="button"
            onClick={() => { resetSession(); router.push('/') }}
            className="w-full text-center font-body text-sm text-neutral-400 hover:text-neutral-600 transition-colors py-2"
          >
            {en.result.startAgain}
          </button>
        </div>

        {/* Secondary matches */}
        {runnerUps.length > 0 && (
          <div className="mt-10">
            <p className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase mb-4">
              {en.result.alsoConsider}
            </p>
            <div className="space-y-4">
              {runnerUps.map(({ neighbourhood, score }) => {
                const signals = computeMatchSignals(state, neighbourhood)
                return (
                  <SecondaryMatchCard
                    key={neighbourhood.id}
                    neighbourhood={neighbourhood}
                    score={score}
                    matches={signals.matches}
                    gaps={signals.gaps}
                  />
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )

  const side = (
    <div className="flex flex-col justify-between h-full px-10 py-12">
      <div>
        <p className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase mb-3">
          {en.result.matchLabel}
        </p>
        <h2 className="font-display text-3xl font-bold text-white leading-tight mb-1">
          {matchedNeighbourhood.name}
        </h2>
        <p className="font-display italic text-primary-400 text-lg mb-1">
          {matchedNeighbourhood.tagline}
        </p>
        <p className="font-mono text-2xl text-white mb-8">{winnerScore}%</p>

        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => router.push('/result/listing')}
          >
            {t('result.rentalEntry', { neighbourhood: matchedNeighbourhood.name })}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setSaveOpen(true)}
          >
            {en.result.saveButton}
          </Button>
          <button
            type="button"
            onClick={() => { resetSession(); router.push('/') }}
            className="w-full text-center font-body text-sm text-neutral-400 hover:text-neutral-300 transition-colors py-2"
          >
            {en.result.startAgain}
          </button>
        </div>
      </div>

      <div className="border-t border-neutral-700 pt-8">
        <p className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase mb-3">
          {en.result.worthKnowingLabel}
        </p>
        <p className="font-body text-sm text-neutral-300 leading-relaxed">
          {en.result.worthKnowing}
        </p>
      </div>
    </div>
  )

  return (
    <>
      <SidePanelLayout main={main} side={side} />
      <SaveBottomSheet isOpen={saveOpen} onClose={() => setSaveOpen(false)} />
    </>
  )
}
