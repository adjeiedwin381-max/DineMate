import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Fab,
  InputAdornment,
  Alert,
  Snackbar,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  TableRestaurant,
  People,
  CheckCircle,
  Schedule,
  Block,
  Clear,
} from '@mui/icons-material';

const initialTables = [
  { id: 1, number: 'T01', capacity: 2, status: 'available', location: 'Main Floor', notes: 'Window seat' },
  { id: 2, number: 'T02', capacity: 4, status: 'occupied', location: 'Main Floor', notes: '' },
  { id: 3, number: 'T03', capacity: 6, status: 'reserved', location: 'Main Floor', notes: 'Birthday party' },
  { id: 4, number: 'T04', capacity: 2, status: 'available', location: 'Patio', notes: 'Outdoor seating' },
  { id: 5, number: 'T05', capacity: 8, status: 'available', location: 'Private Room', notes: 'Business meetings' },
  { id: 6, number: 'T06', capacity: 4, status: 'occupied', location: 'Main Floor', notes: '' },
  { id: 7, number: 'T07', capacity: 2, status: 'reserved', location: 'Bar Area', notes: 'High top table' },
  { id: 8, number: 'T08', capacity: 6, status: 'available', location: 'Main Floor', notes: '' },
];

const statusColors = {
  available: { color: 'success', icon: CheckCircle },
  occupied: { color: 'error', icon: Block },
  reserved: { color: 'warning', icon: Schedule },
};

export default function TableManagement() {
  const [tables, setTables] = useState(initialTables);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    number: '',
    capacity: 2,
    location: '',
    notes: '',
  });

  const filteredTables = useMemo(() => {
    return tables.filter(table => {
      const matchesSearch = table.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           table.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           table.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
      
      const matchesCapacity = capacityFilter === 'all' || 
                             (capacityFilter === '1-2' && table.capacity <= 2) ||
                             (capacityFilter === '3-4' && table.capacity >= 3 && table.capacity <= 4) ||
                             (capacityFilter === '5-6' && table.capacity >= 5 && table.capacity <= 6) ||
                             (capacityFilter === '7+' && table.capacity >= 7);

      return matchesSearch && matchesStatus && matchesCapacity;
    });
  }, [tables, searchTerm, statusFilter, capacityFilter]);

  const tableStats = useMemo(() => {
    const stats = tables.reduce((acc, table) => {
      acc[table.status] = (acc[table.status] || 0) + 1;
      return acc;
    }, {});

    return {
      total: tables.length,
      available: stats.available || 0,
      occupied: stats.occupied || 0,
      reserved: stats.reserved || 0,
    };
  }, [tables]);

  const handleOpenDialog = (table) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        number: table.number,
        capacity: table.capacity,
        location: table.location || '',
        notes: table.notes || '',
      });
    } else {
      setEditingTable(null);
      setFormData({
        number: '',
        capacity: 2,
        location: '',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTable(null);
  };

const handleSaveTable = () => {
  if (!formData.number.trim()) {
    setSnackbar({ open: true, message: 'Table number is required', severity: 'error' });
    return;
  }

  const tableExists = tables.some(
    (table) =>
      table.number.toLowerCase() === formData.number.toLowerCase() &&
      table.id !== editingTable?.id
  );

  if (tableExists) {
    setSnackbar({ open: true, message: 'Table number already exists', severity: 'error' });
    return;
  }

  if (editingTable) {
    // update existing
    setTables((prev) =>
      prev.map((table) =>
        table.id === editingTable.id ? { ...table, ...formData } : table
      )
    );
    setSnackbar({ open: true, message: 'Table updated successfully', severity: 'success' });
  } else {
    // add new
    const nextId = tables.length > 0 ? Math.max(...tables.map((t) => t.id)) + 1 : 1;

    const newTable = {
      id: nextId,
      ...formData,
      status: 'available',
    };

    setTables((prev) => [...prev, newTable]);
    setSnackbar({ open: true, message: 'Table added successfully', severity: 'success' });
  }

  handleCloseDialog();
};


  const handleDeleteTable = (table) => {
    setTables(prev => prev.filter(t => t.id !== table.id));
    setSnackbar({ open: true, message: 'Table deleted successfully', severity: 'success' });
    handleCloseMenu();
  };

  const handleStatusChange = (table, newStatus) => {
    setTables(prev => prev.map(t => 
      t.id === table.id ? { ...t, status: newStatus } : t
    ));
    setSnackbar({ open: true, message: `Table ${table.number} marked as ${newStatus}`, severity: 'success' });
  };

  const handleMenuClick = (event, table) => {
    setAnchorEl(event.currentTarget);
    setSelectedTable(table);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedTable(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCapacityFilter('all');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Table Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage your restaurant tables, track availability, and update reservations
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {tableStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Tables
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {tableStats.available}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="error.main" fontWeight="bold">
                {tableStats.occupied}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Occupied
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {tableStats.reserved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reserved
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                    labelId="status-label"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="occupied">Occupied</MenuItem>
                    <MenuItem value="reserved">Reserved</MenuItem>
                </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Capacity</InputLabel>
                <Select
                  value={capacityFilter}
                  label="Capacity"
                  onChange={(e) => setCapacityFilter(e.target.value)}
                >
                  <MenuItem value="all">All Sizes</MenuItem>
                  <MenuItem value="1-2">1-2 People</MenuItem>
                  <MenuItem value="3-4">3-4 People</MenuItem>
                  <MenuItem value="5-6">5-6 People</MenuItem>
                  <MenuItem value="7+">7+ People</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Clear />}
                onClick={clearFilters}
                sx={{ height: '56px' }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tables Grid */}
      <Grid container spacing={3}>
        {filteredTables.map((table) => {
          const StatusIcon = statusColors[table.status].icon;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={table.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TableRestaurant color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        {table.number}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, table)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <People fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Capacity: {table.capacity} people
                    </Typography>
                  </Box>

                  <Chip
                    icon={<StatusIcon />}
                    label={table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                    color={statusColors[table.status].color}
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  {table.location && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      📍 {table.location}
                    </Typography>
                  )}

                  {table.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      "{table.notes}"
                    </Typography>
                  )}
                </CardContent>

                {/* Quick Status Change Buttons */}
                <Box sx={{ p: 2, pt: 0 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Button
                        fullWidth
                        size="small"
                        variant={table.status === 'available' ? 'contained' : 'outlined'}
                        color="success"
                        onClick={() => handleStatusChange(table, 'available')}
                        disabled={table.status === 'available'}
                      >
                        Free
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        fullWidth
                        size="small"
                        variant={table.status === 'occupied' ? 'contained' : 'outlined'}
                        color="error"
                        onClick={() => handleStatusChange(table, 'occupied')}
                        disabled={table.status === 'occupied'}
                      >
                        Busy
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        fullWidth
                        size="small"
                        variant={table.status === 'reserved' ? 'contained' : 'outlined'}
                        color="warning"
                        onClick={() => handleStatusChange(table, 'reserved')}
                        disabled={table.status === 'reserved'}
                      >
                        Book
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredTables.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <TableRestaurant sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tables found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search or filter criteria
          </Typography>
          <Button variant="outlined" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add table"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => handleOpenDialog()}
      >
        <Add />
      </Fab>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => {
          if (selectedTable) handleOpenDialog(selectedTable);
          handleCloseMenu();
        }}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Table</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (selectedTable) handleDeleteTable(selectedTable);
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Table</ListItemText>
        </MenuItem>
      </Menu>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTable ? 'Edit Table' : 'Add New Table'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              margin="normal"
              label="Table Number"
              fullWidth
              variant="outlined"
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
              placeholder="e.g., T01, Table 1"
            />
            
            <Select
  value={formData.capacity}
  onChange={(e) =>
    setFormData((prev) => ({
      ...prev,
      capacity: Number(e.target.value),
    }))
  }
>
  <MenuItem value={2}>2</MenuItem>
  <MenuItem value={4}>4</MenuItem>
  <MenuItem value={6}>6</MenuItem>
</Select>   
            
            <TextField
              margin="normal"
              label="Location"
              fullWidth
              variant="outlined"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Main Floor, Patio, Private Room"
            />
            
            <TextField
              margin="normal"
              label="Notes"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any special notes about this table..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTable} variant="contained">
            {editingTable ? 'Update' : 'Add'} Table
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}