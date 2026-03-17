'use client'

interface TextInputProps {
  label:        string
  value:        string
  onChange:     (value: string) => void
  placeholder?: string
  optional?:    string   // label suffix, e.g. "(if you know it)"
  required?:    boolean
  className?:   string
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  optional,
  required = false,
  className = '',
}: TextInputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-body font-semibold text-apt-dark">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-apt-mid">{optional}</span>
        )}
      </label>
      <input
        type="text"
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full px-3 py-2.5 rounded-md border border-apt-mid/20
          bg-apt-cream text-apt-dark font-body text-sm
          placeholder:text-apt-mid
          focus:outline-none focus:border-apt-terra focus:ring-1 focus:ring-apt-terra
          transition-colors duration-150
        "
      />
    </div>
  )
}
