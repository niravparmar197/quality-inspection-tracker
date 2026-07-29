import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

type SummaryCardProps = {
  label: string
  value: number
  colorClassName: string
}

export function SummaryCard({ label, value, colorClassName }: SummaryCardProps) {
  return (
    <Paper elevation={0} sx={{ p: 2.25, borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      <div className={`flex h-9 w-9 items-center justify-center rounded-[10px] ${colorClassName}`}>
        <RadioButtonUncheckedIcon sx={{ fontSize: 18 }} />
      </div>
      <Typography sx={{ fontSize: 26, fontWeight: 800, color: 'text.primary', lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 500 }}>{label}</Typography>
    </Paper>
  )
}
