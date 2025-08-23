import React, { useEffect } from 'react';
import { Grid, Typography, Box, Card, CardContent, CardHeader, Avatar, CircularProgress, LinearProgress, Modal, Fade, Backdrop } from '@mui/material';
import useDashboardStore from '../lib/dashboardStore';
import { PendingActions, DoneAll, ShoppingCart, CreditCard } from '@mui/icons-material';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import useRestaurantStore from '../lib/restaurantStore';
import OwnerDashboard from './dashboards/owner';
import CashierDashboard from './dashboards/cashier';
import AdminDashboard from './dashboards/admin';
import WaiterDashboard from './dashboards/waiter';
import ChefDashboard from './dashboards/chef';
import BartenderDashboard from './dashboards/bartender';

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

  const { selectedRestaurant } = useRestaurantStore();

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
      {selectedRestaurant.role === 'owner' ? <OwnerDashboard /> : selectedRestaurant.role === 'cashier' ? <CashierDashboard /> : selectedRestaurant.role === 'admin' ? <AdminDashboard /> : selectedRestaurant.role === 'waiter' ? <WaiterDashboard /> : selectedRestaurant.role === 'chef' ? <ChefDashboard /> : selectedRestaurant.role === 'bartender' ? <BartenderDashboard /> : <OwnerDashboard />}


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