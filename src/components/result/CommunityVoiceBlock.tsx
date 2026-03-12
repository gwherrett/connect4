import type { CommunityQuote } from '@/types'
import { en } from '@/locales/en'

interface CommunityVoiceBlockProps {
  quote: CommunityQuote | null
}

export function CommunityVoiceBlock({ quote }: CommunityVoiceBlockProps) {
  if (!quote) return null

  return (
    <div className="bg-neutral-50 border-l-4 border-primary-500 px-4 py-3 rounded-sm">
      <p className="text-xs font-body font-semibold tracking-widest text-neutral-400 uppercase mb-3">
        {en.result.communityVoice}
      </p>
      <p className="font-display italic text-neutral-900 text-base leading-relaxed">
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="text-xs text-neutral-400 font-body mt-2">{quote.attribution}</p>
    </div>
  )
}
