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
          className="font-body text-xs bg-apt-lime-tint text-apt-terra font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
        >
          {source}
        </span>
      ))}
    </div>
  )
}
