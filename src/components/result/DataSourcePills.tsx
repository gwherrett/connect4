import { en } from '@/locales/en'

export function DataSourcePills() {
  const sources = [
    en.result.dataSources.walkscore,
    en.result.dataSources.cmhc,
    en.result.dataSources.community,
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {sources.map((source) => (
        <span
          key={source}
          className="font-mono text-xs border border-neutral-200 text-neutral-400 px-2 py-1 rounded-sm"
        >
          {source}
        </span>
      ))}
    </div>
  )
}
