import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

type SummaryCardProps = {
  label: string
  value: number
  color?: string
}

export function SummaryCard({ label, value, color }: SummaryCardProps) {
  return (
    <Paper sx={{ p: 2, flex: 1, minWidth: 140 }} elevation={1}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4" sx={{ color }}>
        {value}
      </Typography>
    </Paper>
  )
}
