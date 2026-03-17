import { en } from '@/locales/en'

interface AnalogousComparisonBlockProps {
  text: string
}

export function AnalogousComparisonBlock({ text }: AnalogousComparisonBlockProps) {
  return (
    <div className="border-l-[3px] border-apt-terra bg-apt-terra-tint px-4 py-3 rounded-sm">
      <p className="text-xs font-body font-semibold tracking-widest text-apt-terra uppercase mb-2">
        {en.result.howItCompares}
      </p>
      <p className="font-body text-sm text-apt-dark">{text}</p>
    </div>
  )
}
