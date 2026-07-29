import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { isOnline, onNetworkChange } from '../utils/network'
import { syncOfflineData } from '../offline/sync.service'
import { useSnackbar } from '../hooks/useSnackbar'

export function OfflineBanner() {
  const { showSnackbar } = useSnackbar()
  const [online, setOnline] = useState(isOnline())

  useEffect(() => {
    return onNetworkChange((nowOnline) => {
      setOnline(nowOnline)
      if (nowOnline) {
        void syncOfflineData().then((count) => {
          if (count > 0) {
            showSnackbar(`Connected — synced ${count} offline inspection(s)`, 'success')
          }
        })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (online) return null

  return (
    <Box
      sx={{
        bgcolor: 'error.main',
        color: 'error.contrastText',
        py: 0.75,
        px: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        🔴 Offline Mode — data will sync automatically when you're back online.
      </Typography>
    </Box>
  )
}
