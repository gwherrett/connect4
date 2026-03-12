'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/context/SessionContext'
import { RentalListingCard } from '@/components/listing/RentalListingCard'
import { ScamShieldModal } from '@/components/modals/ScamShieldModal'
import { en } from '@/locales/en'

export default function ListingPage() {
  const router = useRouter()
  const { matchedNeighbourhood, selectedListing } = useSession()
  const [scamOpen, setScamOpen] = useState(false)

  if (!matchedNeighbourhood || !selectedListing) {
    if (typeof window !== 'undefined') router.replace('/result')
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-lg mx-auto px-5 py-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="font-body text-sm text-neutral-500 hover:text-neutral-800 transition-colors mb-6 block"
        >
          {en.listing.backLink}
        </button>

        <RentalListingCard
          listing={selectedListing}
          neighbourhoodName={matchedNeighbourhood.name}
          onReply={() => setScamOpen(true)}
        />
      </div>

      <ScamShieldModal
        isOpen={scamOpen}
        onClose={() => setScamOpen(false)}
        listing={selectedListing}
      />
    </div>
  )
}
