'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { SidePanelLayout } from '@/components/layout/SidePanelLayout'
import { en } from '@/locales/en'

const NEIGHBOURHOODS = [
  { name: 'Mount Pleasant', tag: 'Creative · Emerging · Walkable' },
  { name: 'Kitsilano', tag: 'Outdoorsy · Family · Beach access' },
  { name: 'Commercial Drive', tag: 'Community · Eclectic · Transit-friendly' },
  { name: 'Yaletown', tag: 'Urban · Professional · Walkable' },
  { name: 'East Van', tag: 'Gritty · Artistic · Affordable' },
  { name: 'Fairview', tag: 'Quiet · Central · Transit access' },
]

function LandingMain() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-apt-cream flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-5 py-16 max-w-lg mx-auto w-full">
        <p className="font-body text-xs font-semibold tracking-widest text-apt-mid uppercase mb-6">
          {en.landing.productLabel}
        </p>
        <h1 className="font-display text-4xl font-bold text-apt-dark leading-tight mb-5">
          {en.landing.headline1}
          <br />
          {en.landing.headline2}
        </h1>
        <p className="font-body text-base text-apt-dark mb-2">
          {en.landing.body}
        </p>
        <p className="font-body text-sm text-apt-mid mb-10">
          {en.landing.subBody}
        </p>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => router.push('/quiz/1')}
        >
          {en.landing.cta}
        </Button>
        <p className="font-body text-xs text-apt-mid text-center mt-4">
          {en.landing.privacyNote}
        </p>
      </div>

      <div className="px-5 pb-12 max-w-lg mx-auto w-full">
        <p className="font-body text-sm text-apt-mid border-t border-apt-mid/20 pt-6">
          {en.landing.supportingCopy}
        </p>
      </div>
    </div>
  )
}

function LandingSidePanel() {
  return (
    <div className="flex flex-col justify-between h-full px-10 py-12">
      <div>
        <p className="font-body text-xs font-semibold tracking-widest text-apt-mid uppercase mb-8">
          Vancouver neighbourhoods
        </p>
        <div className="space-y-5">
          {NEIGHBOURHOODS.map((n) => (
            <div key={n.name} className="border-l-2 border-apt-mid pl-4">
              <p className="font-display text-xl font-bold text-apt-cream">{n.name}</p>
              <p className="font-body text-xs text-apt-mid mt-0.5">{n.tag}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-apt-mid pt-8">
        <p className="font-body text-sm text-apt-mid leading-relaxed">
          Every neighbourhood in Vancouver has a distinct personality. Ten minutes of questions. One match that fits how you actually live.
        </p>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <SidePanelLayout
      main={<LandingMain />}
      side={<LandingSidePanel />}
    />
  )
}
