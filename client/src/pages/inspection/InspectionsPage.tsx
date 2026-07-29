import AddIcon from '@mui/icons-material/Add'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FilterListIcon from '@mui/icons-material/FilterList'
import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useCallback, useEffect, useState } from 'react'
import { inspectionsService } from '../../services/inspections.service'
import { InspectionStatus, Severity, type Inspection } from '../../types/inspection'
import { severityColor, statusColor } from '../../utils/statusColors'
import { getErrorMessage } from '../../utils/errorMessage'
import { formatEnumLabel } from '../../utils/formatLabel'
import { InspectionFormDialog } from '../../components/inspection/InspectionFormDialog'
import { ResolveDialog } from '../../components/inspection/ResolveDialog'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { StatusBadge } from '../../components/common/StatusBadge'
import { OFFLINE_SYNCED_EVENT } from '../../offline/sync.service'
import { useSnackbar } from '../../hooks/useSnackbar'
import { usePageTitle } from '../../hooks/usePageTitle'

const PAGE_SIZE = 8

const inputSx = {
  '& .MuiOutlinedInput-root': { borderRadius: '9px' },
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function InspectionsPage() {
  usePageTitle('Inspections')
  const { showSnackbar } = useSnackbar()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [rows, setRows] = useState<Inspection[]>([])
  const [rowCount, setRowCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [severity, setSeverity] = useState<Severity | ''>('')
  const [status, setStatus] = useState<InspectionStatus | ''>('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const [filtersOpen, setFiltersOpen] = useState(true)

  const [formTarget, setFormTarget] = useState<Inspection | 'new' | null>(null)
  const [resolveTarget, setResolveTarget] = useState<Inspection | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Inspection | null>(null)
  const [deleting, setDeleting] = useState(false)

  const activeFilterCount = [severity, status, fromDate, toDate].filter(Boolean).length

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(0)
    }, 400)
    return () => clearTimeout(timeout)
  }, [search])

  const loadInspections = useCallback(async () => {
    setLoading(true)
    try {
      const result = await inspectionsService.findAll({
        search: debouncedSearch || undefined,
        severity: severity || undefined,
        status: status || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        sort,
        page: page + 1,
        limit: PAGE_SIZE,
      })
      setRows(result.data)
      setRowCount(result.meta.total)
    } catch (error) {
      showSnackbar(getErrorMessage(error), 'error')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, severity, status, fromDate, toDate, sort])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadInspections()
  }, [loadInspections])

  useEffect(() => {
    const onSynced = () => void loadInspections()
    window.addEventListener(OFFLINE_SYNCED_EVENT, onSynced)
    return () => window.removeEventListener(OFFLINE_SYNCED_EVENT, onSynced)
  }, [loadInspections])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await inspectionsService.remove(deleteTarget.id)
      setDeleteTarget(null)
      void loadInspections()
      showSnackbar('Inspection deleted', 'success')
    } catch (error) {
      showSnackbar(getErrorMessage(error), 'error')
    } finally {
      setDeleting(false)
    }
  }

  const resetFilters = () => {
    setSeverity('')
    setStatus('')
    setFromDate('')
    setToDate('')
    setPage(0)
  }

  const rangeStart = rowCount === 0 ? 0 : page * PAGE_SIZE + 1
  const rangeEnd = Math.min(page * PAGE_SIZE + PAGE_SIZE, rowCount)
  const prevDisabled = page === 0
  const nextDisabled = page * PAGE_SIZE + PAGE_SIZE >= rowCount

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2.5,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Inspections</Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{rowCount} records</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormTarget('new')}
        >
          New Inspection
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: '14px', p: 2, mb: 2.25 }}>
        <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
          <TextField
            placeholder="Search machine..."
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={inputSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            onClick={() => setFiltersOpen((v) => !v)}
            startIcon={<FilterListIcon sx={{ fontSize: 18 }} />}
            variant="outlined"
            sx={{ borderColor: '#e2e8f0', color: 'text.primary', flexShrink: 0, gap: 0.5 }}
          >
            Filters
            {activeFilterCount > 0 && (
              <Box
                component="span"
                sx={{
                  bgcolor: 'primary.main',
                  color: '#fff',
                  fontSize: 10.5,
                  fontWeight: 700,
                  px: 0.75,
                  borderRadius: 999,
                  ml: 0.75,
                }}
              >
                {activeFilterCount}
              </Box>
            )}
          </Button>
          <Tooltip title={sort === 'desc' ? 'Newest first' : 'Oldest first'}>
            <IconButton
              onClick={() => {
                setSort((s) => (s === 'desc' ? 'asc' : 'desc'))
                setPage(0)
              }}
              sx={{ border: '1.5px solid #e2e8f0', borderRadius: '9px', flexShrink: 0 }}
            >
              {sort === 'desc' ? (
                <ArrowDownwardIcon sx={{ fontSize: 18 }} />
              ) : (
                <ArrowUpwardIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        {filtersOpen && (
          <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', mt: 1.5 }}>
            <TextField
              select
              size="small"
              label="Severity"
              value={severity}
              onChange={(e) => {
                setSeverity(e.target.value as Severity | '')
                setPage(0)
              }}
              sx={{ minWidth: 140, ...inputSx }}
            >
              <MenuItem value="">All severities</MenuItem>
              {Object.values(Severity).map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              label="Status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as InspectionStatus | '')
                setPage(0)
              }}
              sx={{ minWidth: 140, ...inputSx }}
            >
              <MenuItem value="">All statuses</MenuItem>
              {Object.values(InspectionStatus).map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="From"
              type="date"
              size="small"
              sx={inputSx}
              slotProps={{ inputLabel: { shrink: true } }}
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value)
                setPage(0)
              }}
            />
            <TextField
              label="To"
              type="date"
              size="small"
              sx={inputSx}
              slotProps={{ inputLabel: { shrink: true } }}
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value)
                setPage(0)
              }}
            />
            {activeFilterCount > 0 && (
              <Button onClick={resetFilters} sx={{ color: 'text.secondary' }}>
                Clear
              </Button>
            )}
          </Box>
        )}
      </Paper>

      {loading && rows.length === 0 ? (
        <LoadingScreen />
      ) : rowCount === 0 ? (
        <Paper elevation={0} sx={{ borderRadius: '14px' }}>
          <EmptyState message="No inspections found" />
        </Paper>
      ) : isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {rows.map((item) => (
            <Paper key={item.id} elevation={0} sx={{ borderRadius: '14px', p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 700 }}>{item.machineId}</Typography>
                  <Typography sx={{ fontSize: 12.5, color: 'text.secondary', mt: 0.25 }}>
                    {formatEnumLabel(item.defectType)}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 12, color: '#94a3b8' }}>
                  {formatDate(item.inspectionDate)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.75, mb: 1.5 }}>
                <StatusBadge label={item.severity} className={severityColor[item.severity]} />
                <StatusBadge label={item.status} className={statusColor[item.status]} />
              </Box>
              <Box sx={{ display: 'flex', gap: 1, borderTop: '1px solid #f1f5f9', pt: 1.25 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EditIcon sx={{ fontSize: 15 }} />}
                  onClick={() => setFormTarget(item)}
                  sx={{ borderColor: '#e2e8f0', color: 'text.primary' }}
                >
                  Edit
                </Button>
                {item.status === InspectionStatus.OPEN && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CheckCircleIcon sx={{ fontSize: 15 }} />}
                    onClick={() => setResolveTarget(item)}
                    sx={{ borderColor: '#bbf7d0', bgcolor: '#f0fdf4', color: '#15803d', '&:hover': { borderColor: '#bbf7d0', bgcolor: '#dcfce7' } }}
                  >
                    Resolve
                  </Button>
                )}
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => setDeleteTarget(item)}
                    sx={{ border: '1px solid #fecaca', bgcolor: '#fef2f2', color: '#dc2626', borderRadius: '9px', flexShrink: 0 }}
                  >
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <Paper elevation={0} sx={{ borderRadius: '14px', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                {['Date', 'Machine', 'Defect Type', 'Severity', 'Status', 'Resolve', 'Actions'].map((head) => (
                  <TableCell
                    key={head}
                    align={head === 'Resolve' || head === 'Actions' ? 'center' : 'left'}
                    sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.4 }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell sx={{ fontSize: 13.5 }}>{formatDate(item.inspectionDate)}</TableCell>
                  <TableCell sx={{ fontSize: 13.5, fontWeight: 600 }}>{item.machineId}</TableCell>
                  <TableCell sx={{ fontSize: 13.5 }}>{formatEnumLabel(item.defectType)}</TableCell>
                  <TableCell>
                    <StatusBadge label={item.severity} className={severityColor[item.severity]} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge label={item.status} className={statusColor[item.status]} />
                  </TableCell>
                  <TableCell align="center">
                    {item.status === InspectionStatus.OPEN && (
                      <Tooltip title="Resolve">
                        <IconButton
                          size="small"
                          onClick={() => setResolveTarget(item)}
                          sx={{ border: '1px solid #bbf7d0', bgcolor: '#f0fdf4', color: '#15803d', borderRadius: '8px' }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => setFormTarget(item)}
                          sx={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteTarget(item)}
                          sx={{ border: '1px solid #fecaca', bgcolor: '#fef2f2', color: '#dc2626', borderRadius: '8px' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {rowCount > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, flexWrap: 'wrap', gap: 1.25 }}>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            {rangeStart}–{rangeEnd} of {rowCount}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              disabled={prevDisabled}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              variant="outlined"
              sx={{ borderColor: '#e2e8f0', color: 'text.primary' }}
            >
              Previous
            </Button>
            <Button
              disabled={nextDisabled}
              onClick={() => setPage((p) => p + 1)}
              variant="outlined"
              sx={{ borderColor: '#e2e8f0', color: 'text.primary' }}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}

      <InspectionFormDialog
        open={formTarget !== null}
        inspection={formTarget === 'new' || formTarget === null ? null : formTarget}
        onClose={() => setFormTarget(null)}
        onSuccess={(savedOffline) => {
          const isEdit = formTarget !== 'new'
          setFormTarget(null)
          void loadInspections()

          if (savedOffline) {
            showSnackbar(
              "You're offline — inspection saved locally and will sync automatically.",
              'info',
            )
          } else {
            showSnackbar(isEdit ? 'Inspection updated' : 'Inspection created', 'success')
          }
        }}
      />

      <ResolveDialog
        open={resolveTarget !== null}
        inspection={resolveTarget}
        onClose={() => setResolveTarget(null)}
        onSuccess={() => {
          setResolveTarget(null)
          void loadInspections()
          showSnackbar('Inspection resolved', 'success')
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete inspection"
        message={
          deleteTarget
            ? `Delete the inspection for ${deleteTarget.machineId} — ${formatEnumLabel(deleteTarget.defectType)}? This cannot be undone.`
            : ''
        }
        confirmText={deleting ? 'Deleting…' : 'Delete'}
        confirmDisabled={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  )
}
