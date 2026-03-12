import { en } from '@/locales/en'

export function WorthKnowingBlock() {
  return (
    <div className="bg-neutral-100 rounded-md px-4 py-3">
      <p className="text-xs font-body font-semibold tracking-widest text-neutral-400 uppercase mb-2">
        {en.result.worthKnowingLabel}
      </p>
      <p className="font-body text-sm text-neutral-600 leading-relaxed">
        {en.result.worthKnowing}
      </p>
    </div>
  )
}
