import Image from 'next/image'
import { t } from '@/locales/en'

interface ListingPhotoStripProps {
  photos: [string, string, string]
  alt:    string
}

export function ListingPhotoStrip({ photos, alt }: ListingPhotoStripProps) {
  return (
    <div className="flex gap-2 overflow-x-auto" style={{ scrollSnapType: 'x mandatory' }}>
      {photos.map((src, i) => (
        <div
          key={i}
          className="relative shrink-0 rounded-sm overflow-hidden"
          style={{ width: 280, height: 200, scrollSnapAlign: 'start' }}
        >
          <Image
            src={src}
            alt={t('listing.photoAlt', { alt, number: String(i + 1) })}
            fill
            className="object-cover"
            sizes="280px"
          />
        </div>
      ))}
    </div>
  )
}
