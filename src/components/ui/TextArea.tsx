'use client'

interface TextAreaProps {
  label?:       string
  value:        string
  onChange:     (value: string) => void
  placeholder?: string
  rows?:        number
  className?:   string
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  className = '',
}: TextAreaProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-body font-semibold text-apt-dark">
          {label}
        </label>
      )}
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full px-3 py-2.5 rounded-md border border-apt-mid/20
          bg-apt-cream text-apt-dark font-body text-sm
          placeholder:text-apt-mid resize-none
          focus:outline-none focus:border-apt-terra focus:ring-1 focus:ring-apt-terra
          transition-colors duration-150
        "
      />
    </div>
  )
}
