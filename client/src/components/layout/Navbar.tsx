import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useAuth } from '../../hooks/useAuth'
import { DRAWER_WIDTH } from './Sidebar'

type NavbarProps = {
  onMenuClick: () => void
  onLogoutClick: () => void
}

export function Navbar({ onMenuClick, onLogoutClick }: NavbarProps) {
  const { user } = useAuth()

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { sm: `${DRAWER_WIDTH}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Quality Inspection Tracker
        </Typography>
        {user && (
          <Typography variant="body2" sx={{ mr: 1 }}>
            {user.name}
          </Typography>
        )}
        <Avatar sx={{ width: 32, height: 32, mr: 1 }}>{user?.name.charAt(0)}</Avatar>
        <IconButton color="inherit" onClick={onLogoutClick} aria-label="Logout">
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
