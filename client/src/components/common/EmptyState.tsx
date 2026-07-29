import InboxIcon from '@mui/icons-material/Inbox'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

type EmptyStateProps = {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        py: 6,
        color: 'text.secondary',
      }}
    >
      <InboxIcon sx={{ fontSize: 48, mb: 1 }} />
      <Typography variant="body2">{message}</Typography>
    </Box>
  )
}
