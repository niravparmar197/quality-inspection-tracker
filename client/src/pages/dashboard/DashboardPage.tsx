import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useCallback, useEffect, useState } from 'react'
import { dashboardService } from '../../services/dashboard.service'
import type { DashboardSummary, RecentInspection } from '../../types/dashboard'
import { severityColor, statusColor } from '../../utils/statusColors'
import { getErrorMessage } from '../../utils/errorMessage'
import { SummaryCard } from '../../components/dashboard/SummaryCard'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { useSnackbar } from '../../hooks/useSnackbar'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function DashboardPage() {
  usePageTitle('Dashboard')
  const { showSnackbar } = useSnackbar()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [recent, setRecent] = useState<RecentInspection[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
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
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  if (loading || !summary) {
    return <LoadingScreen />
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        <SummaryCard label="Open" value={summary.open} color="warning.main" />
        <SummaryCard label="Resolved" value={summary.resolved} color="success.main" />
        <SummaryCard label="Critical" value={summary.critical} color="error.main" />
        <SummaryCard label="Major" value={summary.major} color="warning.main" />
        <SummaryCard label="Minor" value={summary.minor} color="info.main" />
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Recent Inspections
      </Typography>
      <Paper>
        {recent.length === 0 ? (
          <EmptyState message="No inspections yet" />
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Machine</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recent.map((inspection) => (
                  <TableRow key={inspection.id}>
                    <TableCell>
                      {new Date(inspection.inspectionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{inspection.machineId}</TableCell>
                    <TableCell>
                      <Chip
                        label={inspection.severity}
                        color={severityColor[inspection.severity]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={inspection.status}
                        color={statusColor[inspection.status]}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
