import Box from '@mui/material/Box';
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import {Grid, CircularProgress, Card, Paper, CardContent, Typography, TextField, Button, FormControl, InputLabel, Select, Stack, MenuItem, Switch, FormControlLabel } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import useReportStore from '../lib/reportStore';
import { CreditCard } from '@mui/icons-material';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import { styled } from '@mui/material/styles';

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

const columns = [
    { field: 'id', headerName: 'Order #', width: 150 },
    { field: 'created_at', headerName: 'Date', width: 330 },
    { field: 'waiter', headerName: 'Waiter', width: 250 },
    { field: 'card', headerName: 'Card', width: 150},
    { field: 'cash', headerName: 'Cash', width: 150},
    { field: 'balance', headerName: 'Change', width: 180},
    { field: 'total', headerName: 'Total', width: 150},
];

const Report = () => {
    const {
        filteredOrders,
        waiters,
        cash,
        balance,
        card,
        total,
        loading,
        getOrdersNow,
        getWaiters, 
        filterOrders,
        clearFilters,
        isFiltered,
    } = useReportStore();

    const [fromDate, setFromDate] = useState(null); 
    const [toDate, setToDate] = useState(null);
    const [selectedWaiter, setSelectedWaiter] = useState('');
    const [showToDate, setShowToDate] = useState(false);
    const [showWaiterSelect, setShowWaiterSelect] = useState(false);
    const [showPendingOnly, setShowPendingOnly] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await getOrdersNow();
            await getWaiters();
        };

        fetchData();
    }, [getOrdersNow, getWaiters]);

    useEffect(() => {
        if (isFiltered) {
            // Ensure filterOrders is not re-triggered unnecessarily
            filterOrders(fromDate, showToDate ? toDate : fromDate, selectedWaiter);
        }
    }, [isFiltered, fromDate, toDate, selectedWaiter, showToDate, filterOrders]); // Removed isRange as it is redundant

    const handleFilter = () => {
        if (showToDate && (!fromDate || !toDate)) {
            Swal.fire('Error', 'Please select both From and To dates.', 'error');
            return;
        }
        if (showToDate && new Date(toDate) < new Date(fromDate)) {
            Swal.fire('Error', 'The "To" date cannot be earlier than the "From" date.', 'error');
            return;
        }
        if (showWaiterSelect && !selectedWaiter) {
            Swal.fire('Error', 'Please select a waiter before filtering.', 'error');
            return;
        }

        // Ensure correct values are passed to filterOrders
        const start = fromDate ? new Date(fromDate).toISOString() : null;
        const end = toDate ? new Date(toDate).toISOString() : null;

        console.log('Triggering filterOrders...', { start, end, selectedWaiter });
        filterOrders(start, end, selectedWaiter);
    };

    const handleClearFilter = () => {
        setFromDate(null);
        setToDate(null);
        setSelectedWaiter('');
        clearFilters();
    };

    const handleRangeToggle = () => {
        setShowToDate(!showToDate);
        if (!showToDate) {
            setToDate(null);
        }
    };

    const handleToggleWaiterSelect = () => {
        setShowWaiterSelect(!showWaiterSelect);
        if (!showWaiterSelect) {
            setSelectedWaiter('');
        }
    };

    const handlePendingToggle = () => {
        setShowPendingOnly(!showPendingOnly);
        if (!showPendingOnly) {
            const pendingOrders = filteredOrders.filter(order => 
                !order.card && !order.cash && !order.balance && !order.total
            );
            filterOrders(null, null, null, pendingOrders); // Pass pending orders to filter
        } else {
            filterOrders(fromDate, showToDate ? toDate : fromDate, selectedWaiter); // Reset to normal filter
        }
    };

    return (
        <>
            <Grid container spacing={1}>
                {/* Total Cash */}
                <Grid item xs={12} md={6} lg={3}>
                    <Card
                        sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        p: 2,
                        boxShadow: 3,
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 6,
                        },
                        '& .bg-icon': {
                            position: 'absolute',
                            fontSize: 200,
                            color: '#3f51b5',
                            opacity: 0.08,
                            right: -40,
                            bottom: -40,
                            zIndex: 0,
                            pointerEvents: 'none',
                            transition: 'all 0.5s ease',
                        },
                        '&:hover .bg-icon': {
                            transform: 'scale(1.1) translate(10px, -10px)',
                            opacity: 0.12,
                        },
                        }}
                    >
                        {/* ✅ Background Icon rendered inside Card */}
                        <CurrencyPoundIcon className="bg-icon" />

                        <CardContent
                        sx={{
                            position: 'relative',
                            zIndex: 1,
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            py: 4,
                        }}
                        >
                            <>
                            <Typography variant="h4" sx={{ color: '#3f51b5', fontWeight: 700 }}>
                                &#163;{cash}
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 900 }}>
                                Cash Received
                            </Typography>
                            </>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Total Card */}
                <Grid item xs={12} md={6} lg={3}>
                    <Card
                        sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        p: 2,
                        boxShadow: 3,
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 6,
                        },
                        '& .bg-icon': {
                            position: 'absolute',
                            fontSize: 200,
                            color: '#3f51b5',
                            opacity: 0.08,
                            right: -40,
                            bottom: -40,
                            zIndex: 0,
                            pointerEvents: 'none',
                            transition: 'all 0.5s ease',
                        },
                        '&:hover .bg-icon': {
                            transform: 'scale(1.1) translate(10px, -10px)',
                            opacity: 0.12,
                        },
                        }}
                    >
                        {/* ✅ Background Icon rendered inside Card */}
                        <CreditCard className="bg-icon" />

                        <CardContent
                        sx={{
                            position: 'relative',
                            zIndex: 1,
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            py: 4,
                        }}
                        >
                            <>
                            <Typography variant="h4" sx={{ color: '#009688', fontWeight: 700 }}>
                                &#163; {card}
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#009688', fontWeight: 500 }}>
                                Card Received
                            </Typography>
                            </>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Total Change */}
                <Grid item xs={12} md={6} lg={3}>
                    <Card
                        sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        p: 2,
                        boxShadow: 3,
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 6,
                        },
                        '& .bg-icon': {
                            position: 'absolute',
                            fontSize: 200,
                            color: '#3f51b5',
                            opacity: 0.08,
                            right: -40,
                            bottom: -40,
                            zIndex: 0,
                            pointerEvents: 'none',
                            transition: 'all 0.5s ease',
                        },
                        '&:hover .bg-icon': {
                            transform: 'scale(1.1) translate(10px, -10px)',
                            opacity: 0.12,
                        },
                        }}
                    >
                        {/* ✅ Background Icon rendered inside Card */}
                        <CurrencyPoundIcon className="bg-icon" />

                        <CardContent
                        sx={{
                            position: 'relative',
                            zIndex: 1,
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            py: 4,
                        }}
                        >
                            <>
                            <Typography variant="h4" sx={{ color: '#9c27b0', fontWeight: 700 }}>
                                &#163; {balance}
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 500 }}>
                                Change/Balance
                            </Typography>
                            </>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Overall Total*/}
                <Grid item xs={12} md={6} lg={3}>
                    <Card
                        sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        p: 2,
                        boxShadow: 3,
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 6,
                        },
                        '& .bg-icon': {
                            position: 'absolute',
                            fontSize: 200,
                            color: '#3f51b5',
                            opacity: 0.08,
                            right: -40,
                            bottom: -40,
                            zIndex: 0,
                            pointerEvents: 'none',
                            transition: 'all 0.5s ease',
                        },
                        '&:hover .bg-icon': {
                            transform: 'scale(1.1) translate(10px, -10px)',
                            opacity: 0.12,
                        },
                        }}
                    >
                        {/* ✅ Move icon here AFTER content */}
                        <CurrencyPoundIcon className="bg-icon" />

                        <CardContent
                        sx={{
                            position: 'relative',
                            zIndex: 1,
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            py: 4,
                        }}
                        >
                            <>
                            <Typography variant="h4" sx={{ color: '#00bcd4', fontWeight: 700 }}>
                                &#163; {total}
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#00bcd4', fontWeight: 500 }}>
                                Total Amount
                            </Typography>
                            </>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
            <Box className="my-2 bg-white p-4 rounded-lg shadow-md text-center" sx={{ borderRadius: 1, height: "50%" }}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        alignItems="center"
                        justifyContent="center"
                        mb={3}
                    >
                        <FormControlLabel
                        sx={{ p:3, borderRadius: 2, bgcolor: 'grey.100' }}
                        control={<IOSSwitch checked={showToDate} onChange={handleRangeToggle} />}
                        label={<Typography variant="h6">Date Range</Typography>}
                        />
                        <FormControlLabel
                        sx={{ p:3, borderRadius: 2, bgcolor: 'grey.100' }}
                        control={<IOSSwitch checked={showWaiterSelect} onChange={handleToggleWaiterSelect} />}
                        label={<Typography variant="h6">Waiter</Typography>}
                        />
                        <FormControlLabel
                        sx={{ p:3, borderRadius: 2, bgcolor: 'grey.100' }}
                        control={
                            <IOSSwitch
                            checked={showPendingOnly}
                            onChange={handlePendingToggle}
                            size="small"
                            />
                        }
                        label={<Typography variant="h6">Pending Orders</Typography>}
                        />
                    </Stack>

                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                        <TextField
                            label="From"
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        </Grid>

                        {showToDate && (
                        <Grid item xs={12} md={3}>
                            <TextField
                            label="To"
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            />
                        </Grid>
                        )}

                        {showWaiterSelect && (
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                            <InputLabel id="waiter-select-label">Waiter</InputLabel>
                            <Select
                                labelId="waiter-select-label"
                                value={selectedWaiter}
                                onChange={(e) => setSelectedWaiter(e.target.value)}
                            >
                                <MenuItem value="">
                                <em>None</em>
                                </MenuItem>
                                {waiters.map((waiter) => (
                                <MenuItem key={waiter.id} value={waiter.name}>
                                    {waiter.name}
                                </MenuItem>
                                ))}
                            </Select>
                            </FormControl>
                        </Grid>
                        )}

                        <Grid item xs={12} md={3}>
                        {isFiltered ? (
                            <Button
                            variant="contained"
                            color="error"
                            size="large"
                            onClick={handleClearFilter}
                            fullWidth
                            sx={{ py: 1.5 }}
                            >
                            Clear Filter
                            </Button>
                        ) : (
                            <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleFilter}
                            fullWidth
                            sx={{ py: 1.5 }}
                            >
                            Apply Filter
                            </Button>
                        )}
                        </Grid>
                    </Grid>
                </Paper>

                {loading ? 
                    <CircularProgress /> 
                    : 
                    <DataGrid
                        columns={columns}
                        rows={showPendingOnly 
                            ? filteredOrders.filter(order => 
                                !order.card && !order.cash && !order.balance && !order.total
                            ) 
                            : filteredOrders}
                        slots={{ toolbar: GridToolbar }}
                        getRowClassName={(params) => {
                            const { card, cash, balance, total } = params.row;
                            return (!card && !cash && !balance && !total) ? 'pending-row' : '';
                        }}
                        sx={{
                            '& .MuiDataGrid-cell': {
                                fontSize: '1.3rem', // Increased font size for cells
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                fontSize: '1.4rem', // Increased font size for column headers
                            },
                            '& .MuiDataGrid-footerContainer': {
                                fontSize: '1.2rem', // Increased font size for footer
                            },
                            '& .pending-row': {
                                backgroundColor: '#ffe135', // Yellowish color for pending rows
                            },
                        }}
                    />
                }
            </Box>
        </>
    );
};

export default Report;