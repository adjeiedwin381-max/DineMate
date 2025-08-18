import React, { useEffect } from "react";
import { Box, Grid, Card, CardContent, CardHeader, Typography, Avatar, CircularProgress, List, ListItem } from '@mui/material';
import { PendingActions, DoneAll } from '@mui/icons-material';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import useKitchenStore from "../lib/kitchenStore";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const Kitchen = () => {
    const { readyMeals, 
            pendingMeals, 
            servedMeals,
            handleFetchPendingMeals, 
            handleFetchReadyMeals, 
            handleUpdateOrderItemStatus,
            handleFetchServedMeals 
        } = useKitchenStore();

    useEffect(() => {
        let isMounted = true;

        // Ensure the store function is called only once
        if (!isMounted) return;
        // Use an AbortController to cancel any ongoing fetch requests if the component unmounts
        const abortController = new AbortController();
        // Fetch order items when the component mounts
        handleFetchPendingMeals();
        handleFetchReadyMeals();
        handleFetchServedMeals();


        return () => {
            isMounted = false;
            abortController.abort(); // Cleanup on unmount
        }
    }, [handleFetchPendingMeals, handleFetchReadyMeals, handleFetchServedMeals]);

    const getTimeAgo = (timestamp)=> {
        return dayjs(timestamp).fromNow(); // e.g., "15 minutes ago"
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    {/* Pending Orders */}
                    <Card
                        sx={{
                            position: 'relative',
                            backgroundColor: '#fefefe',
                            borderRadius: 3,
                            boxShadow: 3,
                            height: "90vh",
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
                        //   title={`${pendingOrders.length} Pending Order${pendingOrders.length !== 1 ? 's' : ''}`}
                            title="Pending Orders"
                            sx={{
                                position: 'sticky',
                                top: 0,
                                zIndex: 2,
                                backgroundColor: '#ff5722',
                                borderBottom: '1px solid #e0e0e0',
                            }}
                            avatar={
                                <Avatar sx={{ backgroundColor: '#ff5722' }}>
                                <PendingActions />
                                </Avatar>
                            }
                            titleTypographyProps={{
                                variant: 'h6',
                                sx: { fontWeight: 'bold', color: '#ffffff' },
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
                            {pendingMeals.length === 0 ? (
                                <Typography textAlign="center" sx={{ mt: 3, color: '#9e9e9e' }}>
                                No pending meals.
                                </Typography>
                            ) : (
                                <List dense disablePadding>
                                {pendingMeals.map((dish, index) => (
                                    <ListItem
                                        key={index}
                                        onClick={() =>
                                            dish.status === 'pending'
                                            ? handleUpdateOrderItemStatus(dish, 'cooking')
                                            : dish.status === 'cooking'
                                            ? handleUpdateOrderItemStatus(dish, 'ready')
                                            : null
                                        }
                                        sx={{
                                            mb: 1.5,
                                            py: 2,
                                            px: 2,
                                            backgroundColor: '#fff3e0',
                                            borderRadius: 2,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            boxShadow: 1,
                                            cursor:
                                            dish.status === 'pending' || dish.status === 'cooking'
                                                ? 'pointer'
                                                : 'default',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                            backgroundColor:
                                                dish.status === 'pending' || dish.status === 'cooking'
                                                ? '#ffe0b2'
                                                : 'transparent',
                                            boxShadow: 2,
                                            },
                                        }}
                                    >
                                    {/* Left side: Dish Info */}
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: 600, color: '#bf360c' }}
                                        >
                                            {dish.menuItems.item_name} {dish.menuItems.description}
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 0.5 }}>
                                        <Typography variant="body2" sx={{ color: '#6d4c41' }}>
                                            Order #{dish.order_no} • Table {dish.orders?.tables?.table_no} • {dish.orders?.waiter?.name}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                            backgroundColor: '#ffccbc',
                                            color: '#bf360c',
                                            fontWeight: 600,
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 1,
                                            }}
                                        >
                                            Qty: {dish.quantity}
                                        </Typography>
                                        </Box>

                                        <Typography variant="body2" sx={{ color: '#6d4c41', mt: 0.5 }}>
                                        {getTimeAgo(dish.created_at)}
                                        </Typography>
                                    </Box>

                                    {/* Right side: Status Icon */}
                                    <Box
                                        sx={{
                                        minWidth: 64,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        }}
                                    >
                                        {dish.status === 'pending' && (
                                        <Typography
                                            variant="caption"
                                            sx={{ fontWeight: 600, color: '#bf360c' }}
                                        >
                                            TAP TO START
                                        </Typography>
                                        )}
                                        {dish.status === 'cooking' && (
                                        <CircularProgress size={40} thickness={8} sx={{ color: '#ff5722' }} />
                                        )}
                                        {dish.status === 'ready' && (
                                        <Typography
                                            variant="caption"
                                            sx={{ fontWeight: 600, color: 'green' }}
                                        >
                                            Ready
                                        </Typography>
                                        )}
                                    </Box>
                                    </ListItem>
                                ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    {/* Ready Orders */}
                    <Card
                        sx={{
                            position: 'relative',
                            backgroundColor: '#fefefe',
                            borderRadius: 3,
                            boxShadow: 3,
                            height: "90vh",
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                    {/* Background Icon */}
                    <AlarmOnIcon
                        className="bg-icon"
                        sx={{
                        position: 'absolute',
                        fontSize: 160,
                        color: '#2196f3',
                        opacity: 0.07,
                        right: -30,
                        bottom: -30,
                        zIndex: 0,
                        pointerEvents: 'none',
                        }}
                    />

                    <CardHeader
                        title="Ready Orders"
                        sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 2,
                        backgroundColor: '#2196f3',
                        borderBottom: '1px solid #e0e0e0',
                        }}
                        avatar={
                        <Avatar sx={{ backgroundColor: '#2196f3' }}>
                            <AlarmOnIcon />
                        </Avatar>
                        }
                        titleTypographyProps={{
                        variant: 'h6',
                        sx: { fontWeight: 'bold', color: '#ffffff' },
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
                        {readyMeals.length === 0 ? (
                            <>
                                <Typography textAlign="center" sx={{ mt: 3, color: '#9e9e9e' }}>
                                    No ready meals.
                                </Typography>
                            </>
                        ) : (
                            <>
                                <List dense disablePadding>
                                {readyMeals.map((dish, index) => (
                                    <ListItem
                                        key={index}
                                        onClick={() => dish.status === 'ready' && handleUpdateOrderItemStatus(dish, 'served')}
                                        sx={{
                                            mb: 1.5,
                                            py: 2,
                                            px: 2,
                                            backgroundColor: '#e3f2fd',
                                            borderRadius: 2,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            boxShadow: 1,
                                            cursor:
                                            dish.status === 'ready'
                                                ? 'pointer'
                                                : 'default',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                            backgroundColor: '#bbdefb',
                                            boxShadow: 2,
                                            },
                                        }}
                                    >
                                    {/* Left Info */}
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0d47a1' }}>
                                            {dish.menuItems.item_name} {dish.menuItems.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 0.5 }}>
                                        <Typography variant="body2" sx={{ color: '#1976d2' }}>
                                            Order #{dish.order_no} • Table {dish.orders?.tables?.table_no} • {dish.orders?.waiter?.name}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                            backgroundColor: '#bbdefb',
                                            color: '#0d47a1',
                                            fontWeight: 600,
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 1,
                                            }}
                                        >
                                            Qty: {dish.quantity}
                                        </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: '#1976d2', mt: 0.5 }}>
                                        {getTimeAgo(dish.created_at)}
                                        </Typography>
                                    </Box>
        
                                    {/* Right Status */}
                                    <Box sx={{ minWidth: 64, display: 'flex', justifyContent: 'center' }}>
                                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#0d47a1' }}>
                                        TAP TO SERVE
                                        </Typography>
                                    </Box>
                                    </ListItem>
                                ))}
                                </List>
                            </>
                        )}
                    </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    {/* Served Orders */}
                    <Card
                        sx={{
                        position: 'relative',
                        backgroundColor: '#fefefe',
                        borderRadius: 3,
                        boxShadow: 3,
                        height: "90vh",
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        }}
                    >
                        {/* Background Icon */}
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
                          title="Served Orders"
                        sx={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 2,
                            backgroundColor: '#4caf50',
                            borderBottom: '1px solid #e0e0e0',
                        }}
                        avatar={
                            <Avatar sx={{ backgroundColor: '#4caf50' }}>
                            <DoneAll />
                            </Avatar>
                        }
                        titleTypographyProps={{
                            variant: 'h6',
                            sx: { fontWeight: 'bold', color: '#ffffff' },
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
                            {servedMeals.length === 0 ? (
                                <>
                                    <Typography textAlign="center" sx={{ mt: 3, color: '#9e9e9e' }}>
                                        No served meals.
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <List dense disablePadding>
                                    {servedMeals.map((dish, index) => (
                                        <ListItem
                                        key={index}
                                        sx={{
                                            mb: 1.5,
                                            py: 2,
                                            px: 2,
                                            backgroundColor: '#e8f5e9',
                                            borderRadius: 2,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            boxShadow: 1,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                            backgroundColor: '#c8e6c9',
                                            boxShadow: 2,
                                            },
                                        }}
                                        >
                                        {/* Left Info */}
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                                            {dish.menuItems.item_name} {dish.menuItems.description}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 0.5 }}>
                                            <Typography variant="body2" sx={{ color: '#43a047' }}>
                                                Order #{dish.order_no} • Table {dish.orders?.tables?.table_no} • {dish.orders?.waiter?.name}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                backgroundColor: '#c8e6c9',
                                                color: '#1b5e20',
                                                fontWeight: 600,
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 1,
                                                }}
                                            >
                                                Qty: {dish.quantity}
                                            </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ color: '#43a047', mt: 0.5 }}>
                                            {getTimeAgo(dish.created_at)}
                                            </Typography>
                                        </Box>

                                        {/* Right Status */}
                                        <Box sx={{ minWidth: 64, display: 'flex', justifyContent: 'center' }}>
                                            {dish.orders?.tables?.table_no ? 
                                                (
                                                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#b00000ff' }}>
                                                        NOT PAID
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#1b5e20' }}>
                                                        PAID
                                                    </Typography>
                                                )
                                            }
                                        </Box>
                                        </ListItem>
                                    ))}
                                    </List>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default Kitchen;