import React, { useEffect } from 'react';
import { Grid, Typography, Box, Card, CardContent, CardHeader, Avatar, CircularProgress, LinearProgress, Modal, Fade, Backdrop } from '@mui/material';
import useDashboardStore from '../lib/dashboardStore';
import { PendingActions, DoneAll, ShoppingCart, CreditCard } from '@mui/icons-material';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '800px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Dashboard = () => {
  const {
    loadingCards,
    loadingChart,
    totalNumberOfOrders,
    totalAmount,
    pendingOrders,
    servedOrders,
    cashPaid,
    cardPaid,
    loadingPendingOrders,
    loadingServedOrders,
    salesData,
    fetchOrders,
    fetchSalesData,
    fetchUser,
    open,
    handleClose,
    orderItems,
    totalQty,
    totalPrice,
    handleFetchOrderItemsByOrderId,
    itemsLoading,
    order,
  } = useDashboardStore();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Fetch user data first
        await fetchUser();

        // Fetch orders and sales data after user is set
        fetchOrders();
        fetchSalesData();
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      }
    };

    initializeDashboard();
  }, [fetchUser, fetchOrders, fetchSalesData]);

  
  return (
    <>
      {/* <Header title="Dashboard" /> */}
      <Grid container spacing={1}>
        {/* Total Orders */}
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
            <ShoppingCart className="bg-icon" />

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
              {loadingCards ? (
                <LinearProgress sx={{ width: '100%' }} />
              ) : (
                <>
                  <Typography variant="h2" sx={{ color: '#3f51b5', fontWeight: 700 }}>
                    {totalNumberOfOrders}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#3f51b5', fontWeight: 900 }}>
                    Total Orders (Last 24 Hours)
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        {/* Cash Paid */}
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
              {loadingCards ? (
                <LinearProgress sx={{ width: '100%' }} />
              ) : (
                <>
                  <Typography variant="h2" sx={{ color: '#009688', fontWeight: 700 }}>
                    &#163; {cashPaid}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#009688', fontWeight: 500 }}>
                    Cash Paid (Last 24 Hours)
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        {/* Card Paid */}
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
              {loadingCards ? (
                <LinearProgress sx={{ width: '100%' }} />
              ) : (
                <>
                  <Typography variant="h2" sx={{ color: '#9c27b0', fontWeight: 700 }}>
                    &#163; {cardPaid}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9c27b0', fontWeight: 500 }}>
                    Card Paid (Last 24 Hours)
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        {/* Total Amount */}
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
              {loadingCards ? (
                <LinearProgress sx={{ width: '100%' }} />
              ) : (
                <>
                  <Typography variant="h2" sx={{ color: '#00bcd4', fontWeight: 700 }}>
                    &#163; {totalAmount}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#00bcd4', fontWeight: 500 }}>
                    Total Amount (Last 24 Hours)
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Orders */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              position: 'relative',
              backgroundColor: '#fefefe',
              borderRadius: 1,
              boxShadow: 3,
              height: 300,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Background Icon */}
            <PendingActions
              className="bg-icon"
              sx={{
                position: 'absolute',
                fontSize: 160,
                color: '#ff5722',
                opacity: 0.07,
                right: -30,
                bottom: -30,
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />

            <CardHeader
              title={`${pendingOrders.length} Pending Order${pendingOrders.length !== 1 ? 's' : ''}`}
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 2,
                backgroundColor: '#f5f5f5',
                borderBottom: '1px solid #e0e0e0',
              }}
              avatar={
                <Avatar sx={{ backgroundColor: '#ff5722' }}>
                  <PendingActions />
                </Avatar>
              }
              titleTypographyProps={{
                variant: 'h6',
                sx: { fontWeight: 'bold', color: '#ff5722' },
              }}
            />

            <CardContent
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                zIndex: 1,
                px: 1,
                pt: 1,
              }}
            >
              {loadingPendingOrders ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }}>
                  <CircularProgress />
                </Box>
              ) : pendingOrders.length === 0 ? (
                <Typography textAlign="center" sx={{ mt: 3, color: '#9e9e9e' }}>
                  No pending orders yet.
                </Typography>
              ) : (
                <Grid container spacing={1}>
                  {pendingOrders.map((order) => (
                    <Grid item xs={4} key={order.id}>
                      <Card
                        onClick={() => handleFetchOrderItemsByOrderId(order.id)} // 🔁 Modal or action
                        sx={{
                          cursor: 'pointer',
                          px: 1.5,
                          py: 2,
                          borderRadius: 2,
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          boxShadow: 1,
                          '&:hover': {
                            backgroundColor: '#fff3e0',
                            boxShadow: 4,
                            transform: 'scale(1.03)',
                          },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ color: '#ff5722', fontWeight: 700, fontSize: '1.4rem' }}
                        >
                          #{order.id}
                        </Typography>
                        {/* <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Table {order.table.table_no}
                        </Typography> */}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Served Orders */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              position: 'relative',
              backgroundColor: '#fefefe',
              borderRadius: 1,
              boxShadow: 3,
              height: 300,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Watermark background icon */}
            <DoneAll
              className="bg-icon"
              sx={{
                position: 'absolute',
                fontSize: 160,
                color: '#4caf50',
                opacity: 0.07,
                right: -30,
                bottom: -30,
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />

            <CardHeader
              title={`${servedOrders.length} Served Order${servedOrders.length !== 1 ? 's' : ''} (Last 24 Hours)`}
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 2,
                backgroundColor: '#f5f5f5',
                borderBottom: '1px solid #e0e0e0',
              }}
              avatar={
                <Avatar sx={{ backgroundColor: '#4caf50' }}>
                  <DoneAll />
                </Avatar>
              }
              titleTypographyProps={{
                variant: 'h6',
                sx: { fontWeight: 'bold', color: '#4caf50' },
              }}
            />

            <CardContent
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                zIndex: 1,
                px: 1,
                pt: 1,
              }}
            >
              {loadingServedOrders ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }}>
                  <CircularProgress />
                </Box>
              ) : servedOrders.length === 0 ? (
                <Typography textAlign="center" sx={{ mt: 3, color: '#9e9e9e' }}>
                  No served orders yet.
                </Typography>
              ) : (
                <Grid container spacing={1}>
                  {servedOrders.map((order) => (
                    <Grid item xs={4} key={order.id}>
                      <Card
                        onClick={() => handleFetchOrderItemsByOrderId(order.id)}  // 🔁 Trigger modal/details
                        sx={{
                          cursor: 'pointer',
                          px: 1.5,
                          py: 2,
                          borderRadius: 2,
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          boxShadow: 1,
                          '&:hover': {
                            backgroundColor: '#e8f5e9',
                            boxShadow: 4,
                            transform: 'scale(1.03)',
                          },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ color: '#4caf50', fontWeight: 700, fontSize: '1.4rem' }}
                        >
                          #{order.id}
                        </Typography>
                        {/* <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          £{order.total}
                        </Typography> */}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sales Chart */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: '#f5f5f5' }}>
            <CardHeader title="Sales Performance (Last 7 Days)" titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <Box
                sx={{
                  height: loadingChart ? 300 : 600, // Enlarged chart height
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {loadingChart ? (
                  <CircularProgress />
                ) : (
                  <Bar
                    data={salesData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => `Total: £${context.raw.toFixed(2)}`,
                          },
                        },
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Day of the Week',
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Total Sales (£)',
                          },
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modal for occupied */}
      {open && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
          sx={{ minWidth: 950 }}
        >
          <Fade in={open}>
            <Box sx={style}>
              { itemsLoading ? 
                <LinearProgress /> 
                : 
                (
                  <span>
                    <Typography variant="h6" component="h2">
                      ORDER NO. {order?.id}
                    </Typography>
                    {orderItems.length > 0 ? (
                      <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table className="table table-striped">
                          <thead className="table-dark">
                            <tr>
                              <th>#</th>
                              <th>Product</th>
                              <th>Price</th>
                              <th>Qty</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderItems?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                {item?.menuItems ? (
                                  <>
                                    <td>{item.menuItems.item_name} {item.menuItems.description}</td>
                                    <td>&#163; {item.menuItems.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>&#163; {item.menuItems.price * item.quantity}</td>
                                  </>
                                ) : (
                                  <>
                                    <td>{item.drinks.name.toUpperCase()}</td>
                                    <td>&#163; {item.drinks.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>&#163; {item.total}</td>
                                  </>
                                )}
                              </tr>
                            ))}
                            <tr className="table-dark">
                              <td colSpan="3">Total</td>
                              <td>{totalQty}</td>
                              <td>&#163; {totalPrice.toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p><em><strong>NOTHING ORDERED YET</strong></em></p>
                        {/* <button className="btn btn-danger" onClick={() => handleResetTable(selectedTable)}>Close Table</button> */}
                      </div>
                    )}
                  </span>
                )
              }
            </Box>
          </Fade>
        </Modal>
      )}
    </>
  );
};

export default Dashboard;