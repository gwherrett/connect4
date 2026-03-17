import type { Neighbourhood, CardVersion } from '@/types'
import { en } from '@/locales/en'
import { MatchScoreBadge } from './MatchScoreBadge'
import { AnalogousComparisonBlock } from './AnalogousComparisonBlock'
import { PersonalityDescriptionBlock } from './PersonalityDescriptionBlock'
import { DataSourcePills } from './DataSourcePills'
import { CommunityVoiceBlock } from './CommunityVoiceBlock'
import { WorthKnowingBlock } from './WorthKnowingBlock'

interface NeighbourhoodMatchCardProps {
  neighbourhood: Neighbourhood
  score:         number       // normalised 0–100
  version:       CardVersion
  analogousText: string       // resolved from analogousComparisons lookup
}

export function NeighbourhoodMatchCard({
  neighbourhood,
  score,
  version,
  analogousText,
}: NeighbourhoodMatchCardProps) {
  const showBAndC = version === 'B' || version === 'C'

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-xs font-body font-semibold tracking-widest text-apt-mid uppercase mb-1">
          {en.result.matchLabel}
        </p>
        <h1 className="font-display text-4xl font-bold text-apt-dark leading-tight">
          {neighbourhood.name}
        </h1>
        <p className="font-display italic text-apt-terra text-lg mt-1">
          {neighbourhood.tagline}
        </p>
      </div>

      {/* Score */}
      <MatchScoreBadge score={score} />

      {/* Version B + C blocks */}
      {showBAndC && (
        <>
          <AnalogousComparisonBlock text={analogousText} />
          <PersonalityDescriptionBlock text={neighbourhood.personalityDescription} />
          <DataSourcePills />
        </>
      )}

      {/* Version C only — silent if null */}
      {version === 'C' && (
        <CommunityVoiceBlock quote={neighbourhood.communityQuote} />
      )}

      {/* Worth knowing — B + C only */}
      {showBAndC && <WorthKnowingBlock />}
    </div>
  )
}
