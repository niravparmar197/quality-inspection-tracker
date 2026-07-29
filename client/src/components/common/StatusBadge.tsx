type StatusBadgeProps = {
  label: string
  className: string
}

export function StatusBadge({ label, className }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${className}`}
    >
      {label}
    </span>
  )
}
