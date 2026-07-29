import Add from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid'
import { useCallback, useEffect, useState } from 'react'
import { inspectionsService } from '../../services/inspections.service'
import { InspectionStatus, Severity, type Inspection } from '../../types/inspection'
import { severityColor, statusColor } from '../../utils/statusColors'
import { getErrorMessage } from '../../utils/errorMessage'
import { InspectionFormDialog } from '../../components/inspection/InspectionFormDialog'
import { ResolveDialog } from '../../components/inspection/ResolveDialog'
import { EmptyState } from '../../components/common/EmptyState'
import { useSnackbar } from '../../hooks/useSnackbar'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function InspectionsPage() {
  usePageTitle('Inspection Management')
  const { showSnackbar } = useSnackbar()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [rows, setRows] = useState<Inspection[]>([])
  const [rowCount, setRowCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [severity, setSeverity] = useState<Severity | ''>('')
  const [status, setStatus] = useState<InspectionStatus | ''>('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const [formTarget, setFormTarget] = useState<Inspection | 'new' | null>(null)
  const [resolveTarget, setResolveTarget] = useState<Inspection | null>(null)

  const resetToFirstPage = () => {
    setPaginationModel((model) => ({ ...model, page: 0 }))
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search)
      resetToFirstPage()
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
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      })
      setRows(result.data)
      setRowCount(result.meta.total)
    } catch (error) {
      showSnackbar(getErrorMessage(error), 'error')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel, debouncedSearch, severity, status, fromDate, toDate])

  useEffect(() => {
    // Fetching data in response to filter/pagination changes, not deriving
    // state from state - this is the standard data-fetching effect pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadInspections()
  }, [loadInspections])

  const columns: GridColDef<Inspection>[] = [
    {
      field: 'inspectionDate',
      headerName: 'Date',
      width: 120,
      valueFormatter: (value: string) => new Date(value).toLocaleDateString(),
    },
    { field: 'machineId', headerName: 'Machine', width: 120 },
    { field: 'defectType', headerName: 'Defect Type', width: 160 },
    {
      field: 'severity',
      headerName: 'Severity',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} color={severityColor[params.value as Severity]} size="small" />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColor[params.value as InspectionStatus]}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row">
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => setFormTarget(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {params.row.status === InspectionStatus.OPEN && (
            <Tooltip title="Resolve">
              <IconButton size="small" onClick={() => setResolveTarget(params.row)}>
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ]

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5">Inspection Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setFormTarget('new')}>
          New Inspection
        </Button>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Search machine"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 160 }}
        />
        <TextField
          select
          label="Severity"
          size="small"
          value={severity}
          onChange={(e) => {
            setSeverity(e.target.value as Severity | '')
            resetToFirstPage()
          }}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.values(Severity).map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Status"
          size="small"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as InspectionStatus | '')
            resetToFirstPage()
          }}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
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
          slotProps={{ inputLabel: { shrink: true } }}
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value)
            resetToFirstPage()
          }}
        />
        <TextField
          label="To"
          type="date"
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value)
            resetToFirstPage()
          }}
        />
      </Stack>

      <Box sx={{ height: 520, bgcolor: 'background.paper' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          rowCount={rowCount}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          disableColumnSorting
          disableRowSelectionOnClick
          columnVisibilityModel={{ defectType: !isMobile }}
          slots={{ noRowsOverlay: () => <EmptyState message="No inspections found" /> }}
        />
      </Box>

      <InspectionFormDialog
        open={formTarget !== null}
        inspection={formTarget === 'new' || formTarget === null ? null : formTarget}
        onClose={() => setFormTarget(null)}
        onSuccess={() => {
          const isEdit = formTarget !== 'new'
          setFormTarget(null)
          void loadInspections()
          showSnackbar(isEdit ? 'Inspection updated' : 'Inspection created', 'success')
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
    </Box>
  )
}
