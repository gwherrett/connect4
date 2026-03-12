interface MatchScoreBadgeProps {
  score: number // 0–100
}

export function MatchScoreBadge({ score }: MatchScoreBadgeProps) {
  return (
    <p className="font-mono text-3xl text-neutral-900">
      {score}%
    </p>
  )
}
