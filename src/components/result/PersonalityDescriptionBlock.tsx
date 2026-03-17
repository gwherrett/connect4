import { en } from '@/locales/en'

interface PersonalityDescriptionBlockProps {
  text: string
}

export function PersonalityDescriptionBlock({ text }: PersonalityDescriptionBlockProps) {
  return (
    <div>
      <p className="text-xs font-body font-semibold tracking-widest text-apt-mid uppercase mb-2">
        {en.result.whatItsLike}
      </p>
      <p className="font-body text-sm text-apt-dark leading-relaxed">{text}</p>
    </div>
  )
}
