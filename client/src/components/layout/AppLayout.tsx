import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { Navbar } from './Navbar'
import { DRAWER_WIDTH, Sidebar } from './Sidebar'

export function AppLayout() {
  const { logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar
        onMenuClick={() => setMobileOpen((open) => !open)}
        onLogoutClick={() => setConfirmLogoutOpen(true)}
      />
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogoutClick={() => setConfirmLogoutOpen(true)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>

      <ConfirmDialog
        open={confirmLogoutOpen}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        onCancel={() => setConfirmLogoutOpen(false)}
        onConfirm={() => {
          setConfirmLogoutOpen(false)
          logout()
        }}
      />
    </Box>
  )
}
