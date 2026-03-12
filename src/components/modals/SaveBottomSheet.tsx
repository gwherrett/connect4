'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { en } from '@/locales/en'

interface SaveBottomSheetProps {
  isOpen:  boolean
  onClose: () => void
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

export function SaveBottomSheet({ isOpen, onClose }: SaveBottomSheetProps) {
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [mounted, setMounted]     = useState(false)
  const panelRef                  = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Reset form on each open
  useEffect(() => {
    if (isOpen) {
      setEmail('')
      setSubmitted(false)
    }
  }, [isOpen])

  // Focus first element on open
  useEffect(() => {
    if (!isOpen || !panelRef.current) return
    const first = panelRef.current.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()
  }, [isOpen])

  // Escape key + focus trap
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab' || !panelRef.current) return

      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!mounted) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sheet — slides up via translate */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={en.save.ariaLabel}
        ref={panelRef}
        className={[
          'fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-lg z-40 p-6',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
        style={{ maxHeight: '60vh', overflowY: 'auto' }}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-5" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 transition-colors"
          aria-label={en.save.closeAriaLabel}
        >
          <X size={20} />
        </button>

        {/* Content */}
        <h2 className="font-display text-xl font-bold text-neutral-900 mb-2">
          {en.save.headline}
        </h2>
        <p className="font-body text-sm text-neutral-600 mb-5">
          {en.save.body}
        </p>

        {submitted ? (
          <p className="font-body text-sm text-success-500 py-2">
            {en.save.confirmation}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={en.save.emailPlaceholder}
              className="w-full px-3 py-2.5 rounded-md border border-neutral-200 text-sm font-body focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              required
            />
            <Button variant="primary" fullWidth type="submit">
              {en.save.cta}
            </Button>
          </form>
        )}

        <p className="font-body text-xs text-neutral-400 text-center mt-4">
          {en.save.privacyNote}
        </p>
      </div>
    </>
  )
}
