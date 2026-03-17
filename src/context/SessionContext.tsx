'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  SessionState,
  Neighbourhood,
  ListingObject,
  CardVersion,
} from '@/types'
import { computeMatch, computeTopMatches } from '@/lib/matching'
import neighbourhoodsData from '@/data/neighbourhoods.json'

const neighbourhoods = neighbourhoodsData as unknown as Neighbourhood[]

// ─── Initial state ────────────────────────────────────────────────────────────

function getInitialCardVersion(): CardVersion {
  const env = process.env.NEXT_PUBLIC_CARD_VERSION
  if (env === 'A' || env === 'B' || env === 'C') return env
  return 'C'
}

const INITIAL_STATE: SessionState = {
  reasonForMoving:          null,
  reasonForMovingOther:     null,
  timeline:                 null,
  timelineOther:            null,
  household:                null,
  householdOther:           null,
  bedrooms:                 null,
  budget:                   null,
  budgetOther:              null,
  transport:                null,
  transportOther:           null,
  freeDay:                  null,
  freeDayOther:             null,
  neighbourhoodEnergy:      null,
  neighbourhoodEnergyOther: null,
  outdoorsAccess:           null,
  outdoorsAccessOther:      null,
  culturalCommunity:        null,
  culturalCommunityText:    null,
  comfortPriority:          null,
  comfortPriorityOther:     null,
  currentCity:              null,
  currentNeighbourhood:     null,
  currentDescription:       null,
  favouriteCity:            null,
  favouriteNeighbourhood:   null,
  favouriteDescription:     null,
  matchedNeighbourhoodId:   null,
  cardVersion:              getInitialCardVersion(),
}

// ─── Context value type ───────────────────────────────────────────────────────

interface SessionContextValue {
  state:                SessionState
  setAnswer:            (field: keyof SessionState, value: unknown) => void
  runMatching:          () => void
  resetSession:         () => void
  // Derived
  isQuizComplete:       boolean
  matchedNeighbourhood: Neighbourhood | null
  selectedListing:      ListingObject | null
  topMatches:           Array<{ neighbourhood: Neighbourhood; score: number }>
}

// ─── Context ──────────────────────────────────────────────────────────────────

const SessionContext = createContext<SessionContextValue | null>(null)

// ─── Provider ────────────────────────────────────────────────────────────────

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(INITIAL_STATE)

  const setAnswer = (field: keyof SessionState, value: unknown) => {
    setState((prev) => ({ ...prev, [field]: value }))
  }

  const runMatching = () => {
    const id = computeMatch(state, neighbourhoods)
    setState((prev) => ({ ...prev, matchedNeighbourhoodId: id }))
  }

  const resetSession = () => {
    setState({ ...INITIAL_STATE, cardVersion: state.cardVersion })
  }

  // Derived values — computed, not stored
  const isQuizComplete =
    state.reasonForMoving !== null &&
    state.timeline !== null &&
    state.household !== null &&
    state.bedrooms !== null &&
    state.budget !== null &&
    state.transport !== null &&
    state.freeDay !== null &&
    state.neighbourhoodEnergy !== null &&
    state.outdoorsAccess !== null &&
    state.culturalCommunity !== null &&
    state.comfortPriority !== null

  const matchedNeighbourhood: Neighbourhood | null = state.matchedNeighbourhoodId
    ? (neighbourhoods.find((n) => n.id === state.matchedNeighbourhoodId) ?? null)
    : null

  const topMatches = useMemo(
    () => state.matchedNeighbourhoodId ? computeTopMatches(state, neighbourhoods, 3) : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  )

  const selectedListing: ListingObject | null = (() => {
    if (!matchedNeighbourhood || !state.bedrooms) return null
    const key =
      state.bedrooms === 1 ? 'oneBed' :
      state.bedrooms === 2 ? 'twoBed' :
      'threeBed'
    return matchedNeighbourhood.listings[key]
  })()

  const value = useMemo<SessionContextValue>(
    () => ({
      state,
      setAnswer,
      runMatching,
      resetSession,
      isQuizComplete,
      matchedNeighbourhood,
      selectedListing,
      topMatches,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  )

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) {
    throw new Error('useSession must be used inside <SessionProvider>')
  }
  return ctx
}
