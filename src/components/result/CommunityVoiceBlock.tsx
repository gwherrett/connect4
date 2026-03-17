import type { CommunityQuote } from '@/types'
import { en } from '@/locales/en'

interface CommunityVoiceBlockProps {
  quote: CommunityQuote | null
}

export function CommunityVoiceBlock({ quote }: CommunityVoiceBlockProps) {
  if (!quote) return null

  return (
    <div className="bg-apt-terra-tint border-l-[3px] border-apt-terra px-4 py-3 rounded-sm">
      <p className="text-xs font-body font-semibold tracking-widest text-apt-terra uppercase mb-3">
        {en.result.communityVoice}
      </p>
      <p className="font-display italic text-apt-dark text-base leading-relaxed">
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="text-xs text-apt-mid font-body mt-2">{quote.attribution}</p>
    </div>
  )
}
