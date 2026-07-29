import AssignmentTurnedIn from '@mui/icons-material/AssignmentTurnedIn'
import Dashboard from '@mui/icons-material/Dashboard'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useLocation, useNavigate } from 'react-router-dom'

export const DRAWER_WIDTH = 240

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <Dashboard fontSize="small" /> },
  { label: 'Inspections', path: '/inspections', icon: <AssignmentTurnedIn fontSize="small" /> },
]

function SidebarContent() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <>
      <Toolbar sx={{ gap: 1.25 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '9px',
            bgcolor: 'primary.main',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 12,
            flexShrink: 0,
          }}
        >
          QI
        </Box>
        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
          Inspection Tracker
        </Typography>
      </Toolbar>
      <List sx={{ px: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: '10px',
              '&.Mui-selected': {
                bgcolor: '#eff6ff',
                color: 'primary.main',
                '& .MuiListItemIcon-root': { color: 'primary.main' },
                '&:hover': { bgcolor: '#eff6ff' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 34, color: 'text.secondary' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontWeight: 600, fontSize: 14 } } }} />
          </ListItemButton>
        ))}
      </List>
    </>
  )
}

type SidebarProps = {
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none', borderRight: '1px solid #eef2f7' },
        }}
      >
        <SidebarContent />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            borderRight: '1px solid #eef2f7',
          },
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    </>
  )
}
