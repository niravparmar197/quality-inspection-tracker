import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { DRAWER_WIDTH, Sidebar } from './Sidebar'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/inspections': 'Inspections',
}

export function AppLayout() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar
        title={PAGE_TITLES[location.pathname] ?? 'Quality Inspection Tracker'}
        onMenuClick={() => setMobileOpen((open) => !open)}
      />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, md: 4 },
          py: { xs: 2, md: 3.5 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
