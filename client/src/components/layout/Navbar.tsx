import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useState, type MouseEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { DRAWER_WIDTH } from './Sidebar'

type NavbarProps = {
  title: string
  onMenuClick: () => void
}

export function Navbar({ title, onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const initials = user?.name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid #eef2f7',
      }}
    >
      <Toolbar sx={{ gap: 1.75 }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{
            display: { md: 'none' },
            border: '1px solid #e2e8f0',
            borderRadius: '9px',
            color: 'text.secondary',
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 700 }}>
          {title}
        </Typography>
        <IconButton onClick={(e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#eff6ff', color: 'primary.main', fontSize: 13, fontWeight: 700 }}>
            {initials}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
          slotProps={{ paper: { sx: { borderRadius: '12px', minWidth: 200, mt: 1 } } }}
        >
          <Box sx={{ px: 1.75, py: 1.25 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={logout} sx={{ color: '#dc2626', gap: 1, fontSize: 13.5 }}>
            <LogoutIcon fontSize="small" />
            Log out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
