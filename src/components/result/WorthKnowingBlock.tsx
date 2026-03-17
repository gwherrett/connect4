import { en } from '@/locales/en'

export function WorthKnowingBlock() {
  return (
    <div className="bg-apt-terra-tint border-l-[3px] border-apt-terra rounded-sm px-4 py-3">
      <p className="text-xs font-body font-semibold tracking-widest text-apt-terra uppercase mb-2">
        {en.result.worthKnowingLabel}
      </p>
      <p className="font-body text-sm text-apt-dark leading-relaxed">
        {en.result.worthKnowing}
      </p>
    </div>
  )
}
