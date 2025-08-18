import React, { useEffect, useState } from "react";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, Alert, AlertTitle, OutlinedInput, InputLabel, FormControl, ToggleButton, ToggleButtonGroup, TextField, Stepper, Step, StepLabel, Typography, Stack, Box, InputAdornment, IconButton, Card, CardContent, CardActionArea, Button, CircularProgress, LinearProgress } from '@mui/material';
import { Search as SearchIcon, Cancel as CancelIcon } from '@mui/icons-material';
import useMenuStore from "../lib/menuStore";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import { printBillOnly, printForKitchen } from "../components/PrintWindow";
import { format } from 'date-fns';

const Menu = () => {
  const {
    assignedTables,
    getAssigendTables,
    chosenTable,
    setChosenTable,
    isSelectedTable,
    assignedTablesLoaded,
    tableSelected,
    drinks,
    getDrinks,
    meals,
    orders,
    getMeals,
    mealsColor,
    mealsBackgroundColor,
    orderTime,
    filterMealsByCategory,
    filterDrinksByCategory,
    drinksColor,
    drinksBackgroundColor,
    searchMeals,
    searchDrinks,
    getOrders,
    totalOrdersPrice,
    totalOrdersQty,
    orderItems,
    orderItemsLoaded,
    orderId,
    waiterName,
    activeStep,
    steps,
    handleNext,
    handleBack,
    proceedToCheckOut,
    formatCashInput,
    setCash,
    cash,
    card,
    setCard,
    addOrUpdateObject,
    handleRemoveItem,
    noTablesFound,
    bill_printed,
    searchMealValue
  } = useMenuStore();

  useEffect(() => {
    const controller = new AbortController();

    getOrders();
    getDrinks();
    getAssigendTables();
    getMeals();

    return () => {
      controller.abort();
    };
  }, [getOrders, getDrinks, getAssigendTables, getMeals]); // Functions included in the dependency array

  const [activeTab, setActiveTab] = useState('meals'); // State to track active tab

  const handleTabChange = (event, newTab) => {
    if (newTab !== null) {
        setActiveTab(newTab);
    }
  };

  function formatDateTime(isoString) {
    const date = new Date(isoString);
    return format(date, "EEE dd MMM yy, hh:mm a").toUpperCase();;
  }

  // Define the content for each step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#fff' }}>
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>#</TableCell>
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Product</TableCell>
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Price</TableCell>
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Qty</TableCell>
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Amount</TableCell>
                  </TableRow>
                </TableHead>

                {orderItemsLoaded ? (
                  <TableBody>
                    {orderItems?.map((item, index) => {
                      const isMenuItem = Boolean(item?.menuItems);
                      const productName = isMenuItem
                        ? `${item.menuItems.item_name?.toUpperCase()} ${item.menuItems.description?.toUpperCase()}`
                        : item?.drinks?.name?.toUpperCase();

                      const price = isMenuItem
                        ? item.menuItems.price
                        : item?.drinks?.price;

                      const amount = isMenuItem
                        ? item.menuItems.price * item.quantity
                        : item.total;

                      return (
                        <TableRow key={index}>
                          <TableCell>
                            {!item?.orders?.printed && (
                              <IconButton onClick={() => handleRemoveItem(item)} color="error" size="small">
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            )}
                          </TableCell>
                          <TableCell>{productName}</TableCell>
                          <TableCell>{price?.toFixed(2)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{amount?.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <LinearProgress sx={{ width: '100%' }} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                <TableFooter>
                  <TableRow sx={{ backgroundColor: 'grey.100' }}>
                    <TableCell colSpan={3}>
                      <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">{totalOrdersQty}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">{totalOrdersPrice}</Typography>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>

            <Stack direction="row" spacing={4} mt={4} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="title">
                  ORDER NO. {orders[0]?.id}
                </Typography>
                <Typography variant="title">
                  {waiterName}
                </Typography>
                <Typography variant="body1">
                  {formatDateTime(orderTime)}
                </Typography>
            </Stack>
          </>
        );
      case 1:
        return (
          <>
            <Stack justifyContent='center' alignItems='center' spacing={3} mt={4}>
              <Typography variant="h6">Total Amount</Typography>
              <Typography variant='h2'><strong>&#163; {formatCashInput(totalOrdersPrice)}</strong></Typography>

              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">Card</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  startAdornment={<InputAdornment position="start">{<CreditScoreIcon/>}</InputAdornment>}
                  label="Amount"
                  value={card}
                  onChange={(e) => {
                    setCard(e.target.value);
                  }}
                />
              </FormControl>

              
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">Cash</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  startAdornment={<InputAdornment position="start">{<CurrencyPoundIcon/>}</InputAdornment>}
                  label="Amount"
                  value={cash}
                  onChange={(e) => {
                    setCash(e.target.value);
                  }}
                />
              </FormControl>
            </Stack>
          </>
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };
  
  

  return(
    <>
      {noTablesFound === true ? 
        <Box display="flex" justifyContent="center" mb={1} sx={{ backgroundColor: '#fff', padding: 2, borderRadius: 2 }}>
          <Alert severity="warning" fullWidth sx={{ width: '100%'}} >
            <AlertTitle>NO TABLES ASSIGNED TO YOU</AlertTitle>
            GO TO TABLE SECTION TO SELECT A TABLE
          </Alert>
        </Box>
        :
        <div className="row">
          <div className="col-8">
            <Box display="flex" justifyContent="center" mb={1} sx={{ backgroundColor: '#fff', padding: 2, borderRadius: 2 }}>
                <>
                  {
                    assignedTablesLoaded === false 
                    ? (<><CircularProgress /></>) 
                    : (
                      <>
                        {assignedTables.map((table, i) => 
                          <Button 
                            variant={isSelectedTable(table) ? "contained" : "outlined"}
                            key={i} 
                            sx={{padding: 4, marginRight: 1}}
                            onClick={() => setChosenTable(table)} // Update selected table
                          >
                            Table {table.table_no}
                          </Button>
                        )}
                      </>
                    )
                  }
                </>
            </Box>
            {!noTablesFound && (<Box mb={1} sx={{ backgroundColor: '#fff', padding: 2, borderRadius: 2 }}>
              {tableSelected === true ? (
                <Stack spacing={3}>
                  <div className="text-center">
                    <ToggleButtonGroup
                      value={activeTab}
                      exclusive
                      fullWidth
                      onChange={handleTabChange}
                      aria-label="Menu Items Toggle"
                      sx={{
                          marginBottom: 2,
                          '& .MuiToggleButton-root': {
                              fontSize: '1.2rem', // Increase font size
                              padding: '10px 20px', // Increase padding
                          },
                      }}
                    >
                      <ToggleButton value="meals" aria-label="Meals">
                          Meals
                      </ToggleButton>
                      <ToggleButton value="drinks" aria-label="Drinks">
                          Drinks
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                  {activeTab === 'meals' && (
                    <TextField 
                      sx={{backgroundColor: '#fff', borderColor: '#fff', my: 2}} 
                      onChange={(e)=> searchMeals(e.target.value)}
                      fullWidth
                      value={searchMealValue}
                      label="Type keyword to search for meal..." 
                      id="search-field-meals" 
                      slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon /> 
                              </InputAdornment>
                            ),
                          },
                      }} 
                    />
                  )}

                  {activeTab === 'drinks' && (
                    <TextField 
                      sx={{backgroundColor: '#fff', borderColor: '#fff', my: 2}} 
                      fullWidth
                      onChange={(e)=> searchDrinks(e.target.value)}
                      label="Type keyword to search for drinks..." 
                      id="search-field-drinks" 
                      margin="normal"
                      slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon /> 
                              </InputAdornment>
                            ),
                          },
                      }} 
                    />
                  )}

                  {activeTab === 'meals' && (
                    <div class="row">
                      <Box sx={{ flexGrow: 1 }} >
                        <Stack spacing={1} direction="row">
                          <Card variant="outlined" className="border-dark" sx={{ width: '100%'}}>
                            <CardActionArea  onClick={()=> filterMealsByCategory('fetch_all', '#000', '#fff')}  >
                              <CardContent>
                                <Typography gutterBottom variant="subtitle2" >
                                  ALL
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>

                          <Card sx={{ width: '100%', backgroundColor: '#ffe135' }}>
                            <CardActionArea onClick={()=> filterMealsByCategory('main meal', '#000', '#ffe135')} >
                              <CardContent>
                                <Typography gutterBottom variant="subtitle2" >
                                  MAIN MEAL
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>

                          <Card sx={{ width: '100%', backgroundColor: '#327fa8', color: "#fff"  }}>
                            <CardActionArea onClick={()=> filterMealsByCategory('traditional', "#fff", '#327fa8')} >
                              <CardContent>
                                <Typography gutterBottom variant="subtitle2" >
                                  TRADITIONAL
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>

                          <Card sx={{ width: '100%', backgroundColor: '#a83236', color: "#fff" }}>
                            <CardActionArea onClick={()=> filterMealsByCategory('soups only', "#fff", '#a83236')} >
                              <CardContent>
                                <Typography gutterBottom variant="subtitle2" >
                                  SOUPS
                                </Typography>
                              </CardContent>
                            </CardActionArea> 
                          </Card>

                          <Card sx={{ width: '100%', backgroundColor: '#62a832', color: "#fff"}}>
                            <CardActionArea onClick={()=> filterMealsByCategory('desserts (STA)', "#fff", '#62a832')} >
                              <CardContent>
                                <Typography gutterBottom variant="subtitle2" >
                                  DESSERTS
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>

                          <Card sx={{ width: '100%', backgroundColor: '#a85032', color: "#fff"}}>
                            <CardActionArea onClick={()=> filterMealsByCategory('extras/ sides', "#fff", '#a85032')} >
                              <CardContent>
                                <Typography gutterBottom variant="subtitle2" >
                                  EXTRAS / SIDES
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>

                          <Card sx={{ width: '100%', backgroundColor: '#8932a8', color: "#fff"}}>
                            <CardActionArea onClick={()=> filterMealsByCategory('starters', "#fff", '#8932a8')} >
                              <CardContent>
                                <Typography gutterBottom variant="subtitle2" >
                                  STARTERS
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        </Stack>
                      </Box>
                    </div>
                  )}

                  {activeTab === 'drinks' && (
                    <div class="row">
                      <Box sx={{ flexGrow: 1 }} >
                        <Stack spacing={1} direction="row">
                          <Card variant="outlined" className="border-dark" sx={{width: '100%'}}>
                            <CardActionArea onClick={()=> filterDrinksByCategory('fetch_all', '#000', '#fff')}  >
                              <CardContent>
                                <Typography gutterBottom variant="subtitle2" >
                                  ALL
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>

                          <Card sx={{width: '100%', backgroundColor: '#ffe135' }}>
                            <CardActionArea onClick={()=> filterDrinksByCategory('wine', '#000', '#ffe135')} >
                              <CardContent>
                                <Typography gutterBottom variant="subtitle2" >
                                  WINE
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>

                          <Card sx={{width: '100%', backgroundColor: '#327fa8', color: "#fff"  }}>
                            <CardActionArea onClick={()=> filterDrinksByCategory('local', "#fff", '#327fa8')} >
                              <CardContent>
                                <Typography gutterBottom variant="subtitle2" >
                                  LOCAL
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>

                          <Card sx={{width: '100%', backgroundColor: '#a83236', color: "#fff" }}>
                            <CardActionArea onClick={()=> filterDrinksByCategory('spirits', "#fff", '#a83236')} >
                              <CardContent>
                                <Typography gutterBottom variant="subtitle2" >
                                  SPIRITS
                                </Typography>
                              </CardContent>
                            </CardActionArea> 
                          </Card>

                          <Card sx={{width: '100%', backgroundColor: '#62a832', color: "#fff"}}>
                            <CardActionArea onClick={()=> filterDrinksByCategory('champagne', "#fff", '#62a832')} >
                              <CardContent>
                                <Typography gutterBottom variant="subtitle2" >
                                  CHAMPAGNE
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>

                          <Card sx={{width: '100%', backgroundColor: '#a85032', color: "#fff"}}>
                            <CardActionArea onClick={()=> filterDrinksByCategory('cocktails (alcohol free)', "#fff", '#a85032')} >
                              <CardContent>
                                <Typography gutterBottom variant="subtitle2" >
                                  COCKTAILS (ALCOHOL FREE)
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>

                          <Card sx={{width: '100%', backgroundColor: '#8932a8', color: "#fff"}}>
                            <CardActionArea onClick={()=> filterDrinksByCategory('cocktails (alcohol)', "#fff", '#8932a8')} >
                              <CardContent>
                                <Typography gutterBottom variant="subtitle2" >
                                COCKTAILS (ALCOHOL)
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>

                          <Card sx={{width: '100%', backgroundColor: '#12040b', color: "#fff"}}>
                            <CardActionArea onClick={()=> filterDrinksByCategory('soft drinks', "#fff", '#12040b')} >
                              <CardContent>
                                <Typography gutterBottom variant="subtitle2" >
                                  SOFT DRINKS
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        </Stack>
                      </Box>
                    </div>
                  )}
                </Stack>
              ) : (
                <Alert severity="info" variant="filled" sx={{ width: '100%'}}><h6>SELECT A TABLE TO OPEN MENU</h6></Alert>
              )}
            </Box>)}
            {tableSelected && (
              <>
                <Box mb={1} sx={{ backgroundColor: '#fff', padding: 2, borderRadius: 2 }}>
                  {activeTab === 'meals' && (
                    <div class="row" style={{ width: '100%'}}>
                      {meals?.length === 0  ? (
                        <div class="col-12">
                          <Typography variant="button" component="h5">No Item(s) Found</Typography>
                        </div>
                      ) : (
                        <>
                            {meals?.map((item, i)=>
                              <div class="col-3 mb-3" key={i}>
                                <Card variant="outlined" className="border-dark" sx={{ maxWidth: 345 , backgroundColor: mealsBackgroundColor, color: mealsColor}}>
                                  <CardActionArea onClick={()=> addOrUpdateObject(item)}>
                                    <CardContent>
                                      <Typography gutterBottom variant="subtitle2">
                                        {item.item_name?.toUpperCase()} {item.description?.toUpperCase()}  
                                      </Typography>
                                      <Typography variant="body2">
                                        &#163; {item.price}  
                                      </Typography>
                                    </CardContent>
                                  </CardActionArea>
                                </Card>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  )}

                  {activeTab === 'drinks' && (
                    <div class="row">
                      <div class="col-12">
                        <div class="row m-2">
                            {drinks?.length === 0  ? (
                                <Typography variant="button" component="h5">No Item(s) Found</Typography>
                            ) : (
                              <>
                                  {drinks?.map((item, i)=>
                                    <div class="col-3 mb-3" key={i}>
                                      <Card variant="outlined" className="border-dark" sx={{ maxWidth: 345 , backgroundColor: drinksBackgroundColor, color: drinksColor}}>
                                        <CardActionArea onClick={()=> addOrUpdateObject(item)}>
                                          <CardContent>
                                            <Typography gutterBottom variant="subtitle2">
                                              {item.name?.toUpperCase()} 
                                            </Typography>
                                            <Typography variant="body2">
                                              &#163; {item.price}  
                                            </Typography>
                                          </CardContent>
                                        </CardActionArea>
                                      </Card>
                                    </div>                                              
                                  )}
                              </>
                            )}

                        </div>
                      </div>
                    </div>
                  )}
                </Box>
              </>
            )}
          </div>
          {!noTablesFound && (<div className="col-4">
            {tableSelected ? (
              <div class="card">
                <div class="card-header">
                  {totalOrdersPrice > 0 && (
                    <Stack direction="row" spacing={1}>
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        disabled={proceedToCheckOut === true}
                        sx={{padding: 2}} 
                        size="large"
                        startIcon={<SoupKitchenIcon/>}
                        onClick={()=> printForKitchen(orderId, waiterName, chosenTable, orderItems)}
                      >
                        Print For Kitchen
                      </Button>
      
                      <Button 
                        fullWidth 
                        variant="contained" 
                        sx={{padding: 2}} 
                        size="large"
                        disabled={proceedToCheckOut === true}
                        startIcon={<ReceiptLongIcon/>}
                        onClick={()=> printBillOnly(orderId, waiterName, chosenTable, totalOrdersQty, totalOrdersPrice, orderItems)}
                      >
                        Print Bill Only
                      </Button>
                    </Stack>
                  )}
                </div>
                
                <div class="card-body">
                  <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={activeStep}>
                      {steps.map((label, index) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                    {activeStep === steps.length ? (
                      <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                          All steps completed - you&apos;re finished
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                          <Box sx={{ flex: '1 1 auto' }} />
                          {/* <Button onClick={handleReset}>Reset</Button> */}
                        </Box>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Box sx={{ mt: 2 }}>{getStepContent(activeStep)}</Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                          <Box sx={{ flex: '1 1 auto' }} />
                        </Box>
                      </React.Fragment>
                    )}
                  </Box>
                </div>

                <div class="card-footer text-body-secondary">
                  {totalOrdersPrice > 0 && (
                    <>
                      {proceedToCheckOut ? (
                        <Stack direction="row" spacing={1}>
                          <Button 
                          fullWidth 
                          variant="contained" 
                          sx={{padding: 2}} 
                          size="large" 
                          color="warning" 
                          startIcon={<KeyboardBackspaceIcon/>}
                          onClick={handleBack}
                          >
                            Back
                          </Button>

                          <Button 
                            fullWidth 
                            variant="contained" 
                            sx={{padding: 2}} 
                            size="large" 
                            color="success" 
                            endIcon={<PriceCheckIcon/>}
                            onClick={handleNext}
                          >
                            Confirm Payment
                          </Button>
                        </Stack>
                      ) : (
                        <Button 
                          fullWidth 
                          variant="contained" 
                          sx={{padding: 2}} 
                          size="large" 
                          color="success" 
                          disabled={bill_printed ? false : true}
                          endIcon={<ShoppingCartCheckoutIcon/>}
                          onClick={handleNext}
                        >
                          Proceed To CheckOut
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <Box display="flex" justifyContent="center" mb={1} sx={{ backgroundColor: '#fff', padding: 2, borderRadius: 2 }}>
                <Alert severity="info" variant="filled" sx={{ width: '100%'}}><h6>SELECT A TABLE TO OPEN RECEIPT</h6></Alert>
              </Box>
            )}
          </div>)}
        </div>
      }
    </>
  )
}

export default Menu;