import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useCallback, useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { dashboardService } from '../../services/dashboard.service'
import type { DashboardSummary, RecentInspection } from '../../types/dashboard'
import { severityColor, statusColor } from '../../utils/statusColors'
import { getErrorMessage } from '../../utils/errorMessage'
import { SummaryCard } from '../../components/dashboard/SummaryCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { OFFLINE_SYNCED_EVENT } from '../../offline/sync.service'
import { useSnackbar } from '../../hooks/useSnackbar'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function DashboardPage() {
  usePageTitle('Dashboard')
  const { showSnackbar } = useSnackbar()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [recent, setRecent] = useState<RecentInspection[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const [summaryData, recentData] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getRecent(5),
      ])
      setSummary(summaryData)
      setRecent(recentData)
    } catch (error) {
      showSnackbar(getErrorMessage(error), 'error')
    } finally {
      if (!silent) setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  useEffect(() => {
    const onSynced = () => void load(true)
    window.addEventListener(OFFLINE_SYNCED_EVENT, onSynced)
    return () => window.removeEventListener(OFFLINE_SYNCED_EVENT, onSynced)
  }, [load])

  if (loading || !summary) {
    return <LoadingScreen />
  }

  const cards = [
    { label: 'Open', value: summary.open, colorClassName: statusColor.OPEN },
    { label: 'Resolved', value: summary.resolved, colorClassName: statusColor.RESOLVED },
    { label: 'Critical', value: summary.critical, colorClassName: severityColor.CRITICAL },
    { label: 'Major', value: summary.major, colorClassName: severityColor.MAJOR },
    { label: 'Minor', value: summary.minor, colorClassName: severityColor.MINOR },
  ]

  return (
    <Box>
      <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 0.5 }}>Dashboard</Typography>
      <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 3 }}>
        Overview of inspection activity across all machines.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
          gap: 1.75,
          mb: 4,
        }}
      >
        {cards.map((card) => (
          <SummaryCard
            key={card.label}
            label={card.label}
            value={card.value}
            colorClassName={card.colorClassName}
          />
        ))}
      </Box>

      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1.75 }}>Open vs Resolved by Severity</Typography>

      <Paper elevation={0} sx={{ borderRadius: '14px', overflow: 'hidden', mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              {['Severity', 'Open', 'Resolved', 'Total'].map((head) => (
                <TableCell
                  key={head}
                  align={head === 'Severity' ? 'left' : 'center'}
                  sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.4 }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {summary.bySeverity.map((row) => (
              <TableRow key={row.severity}>
                <TableCell>
                  <StatusBadge label={row.severity} className={severityColor[row.severity]} />
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 13.5 }}>{row.open}</TableCell>
                <TableCell align="center" sx={{ fontSize: 13.5 }}>{row.resolved}</TableCell>
                <TableCell align="center" sx={{ fontSize: 13.5, fontWeight: 700 }}>{row.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.75 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Recent Inspections</Typography>
        <Link component={RouterLink} to="/inspections" sx={{ fontSize: 13.5, fontWeight: 600 }}>
          View all
        </Link>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: '14px', overflow: 'hidden' }}>
        {recent.length === 0 ? (
          <EmptyState message="No inspections yet" />
        ) : isMobile ? (
          <Box>
            {recent.map((inspection) => (
              <Box
                key={inspection.id}
                sx={{ p: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 0.75 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{inspection.machineId}</Typography>
                  <StatusBadge label={inspection.severity} className={severityColor[inspection.severity]} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>
                    {new Date(inspection.inspectionDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Typography>
                  <StatusBadge label={inspection.status} className={statusColor[inspection.status]} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                {['Date', 'Machine', 'Severity', 'Status'].map((head) => (
                  <TableCell
                    key={head}
                    sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.4 }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {recent.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell sx={{ fontSize: 13.5, color: 'text.primary' }}>
                    {new Date(inspection.inspectionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13.5, fontWeight: 600 }}>{inspection.machineId}</TableCell>
                  <TableCell>
                    <StatusBadge label={inspection.severity} className={severityColor[inspection.severity]} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge label={inspection.status} className={statusColor[inspection.status]} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  )
}
