'use client'

import type { ListingObject } from '@/types'
import { Button } from '@/components/ui/Button'
import { ListingPhotoStrip } from './ListingPhotoStrip'
import { t } from '@/locales/en'

interface RentalListingCardProps {
  listing:          ListingObject
  neighbourhoodName: string
  onReply:          () => void
}

export function RentalListingCard({
  listing,
  neighbourhoodName,
  onReply,
}: RentalListingCardProps) {
  const price = `$${listing.price.toLocaleString('en-CA')}/month`
  const titleBar = t('listing.titleBar', {
    neighbourhood: neighbourhoodName,
    bedrooms: String(listing.bedroomCount),
    price,
  })
  const postedAt = t('listing.postedAt', { time: listing.postedAt })

  return (
    // Intentional Craigslist aesthetic inside — system fonts, no Palatino, no brand colour
    <div
      className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >
      {/* Title bar */}
      <div className="px-4 pt-4 pb-2 border-b border-neutral-100">
        <p className="text-sm font-semibold text-neutral-700">{titleBar}</p>
      </div>

      {/* Listing body */}
      <div className="px-4 pt-3 pb-2">
        <h2 className="text-base font-semibold text-neutral-900 leading-snug mb-1">
          {listing.headline}
        </h2>
        <p className="text-xs text-neutral-500 mb-4">{postedAt}</p>
      </div>

      {/* Photo strip — full bleed */}
      <div className="px-4 mb-4">
        <ListingPhotoStrip
          photos={listing.photos}
          alt={`${neighbourhoodName} rental`}
        />
      </div>

      {/* Body text */}
      <div className="px-4 pb-4">
        <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
          {listing.bodyText}
        </p>
      </div>

      {/* CTA — primary styled: this is the user's action point */}
      <div className="px-4 pb-5">
        <Button variant="primary" fullWidth onClick={onReply}>
          {t('listing.replyCta')}
        </Button>
      </div>
    </div>
  )
}
