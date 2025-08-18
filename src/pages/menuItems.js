import Box from '@mui/material/Box';
import { useEffect, useState } from "react";
import { Button, Stack, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import useMenuItemsStore from '../lib/menuItemsStore';

const MenuItems = () => {
    const {
        filteredMeals,
        filteredDrinks,
        name,
        description,
        price,
        category,
        drink,
        categoryDrinks,
        editingRow,
        rowData,
        loadingMeals,
        loadingDrinks,
        fetchMeals,
        fetchDrinks,
        handleAddMeal,
        handleAddDrink,
        handleEditStart,
        handleEditChange,
        handleEditStop,
        handleSaveMeal,
        handleSaveDrink,
        handleDeleteMeal,
        handleDeleteDrink,
    } = useMenuItemsStore();

    const [activeTab, setActiveTab] = useState('meals'); // State to track active tab

    const handleTabChange = (event, newTab) => {
        if (newTab !== null) {
            setActiveTab(newTab);
        }
    };
    
    useEffect(() => {
        fetchMeals();
        fetchDrinks();
    }, [fetchMeals, fetchDrinks]);


    const mealColumns = [
        {
            field: 'item_name',
            headerName: 'Name',
            flex: 2,
            renderCell: (params) =>
                editingRow === params.id ? (
                    <TextField
                        size="small"
                        value={rowData.item_name || ''}
                        onChange={(e) => handleEditChange('item_name', e.target.value)}
                    />
                ) : (
                    params.value
                ),
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 2,
            renderCell: (params) =>
                editingRow === params.id ? (
                    <TextField
                        size="small"
                        value={rowData.description || ''}
                        onChange={(e) => handleEditChange('description', e.target.value)}
                    />
                ) : (
                    params.value || '-' // Display a dash if no description is available
                ),
        },
        {
            field: 'price',
            headerName: 'Price',
            flex: 1,
            renderCell: (params) =>
                editingRow === params.id ? (
                    <TextField
                        size="small"
                        value={rowData.price || ''}
                        onChange={(e) => handleEditChange('price', e.target.value)}
                    />
                ) : (
                    params.value
                ),
        },
        {
            field: 'category',
            headerName: 'Category',
            flex: 1,
            renderCell: (params) =>
                editingRow === params.id ? (
                    <FormControl size="small" fullWidth>
                        <Select
                            value={rowData.category || ''}
                            onChange={(e) => handleEditChange('category', e.target.value)}
                        >
                            <MenuItem value="traditional">Traditional</MenuItem>
                            <MenuItem value="main meal">Main Meal</MenuItem>
                            <MenuItem value="soups only">Soups Only</MenuItem>
                            <MenuItem value="extras/sides">Extras/Sides</MenuItem>
                            <MenuItem value="desserts">Desserts</MenuItem>
                            <MenuItem value="starters">Starters</MenuItem>
                        </Select>
                    </FormControl>
                ) : (
                    params.value
                ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            flex: 1,
            getActions: (params) => [
                editingRow === params.id ? (
                    <GridActionsCellItem
                        icon={<SaveIcon />}
                        label="Save"
                        onClick={() => handleSaveMeal(params.id)}
                    />
                ) : (
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={() => handleEditStart(params.id, params.row)}
                    />
                ),
                editingRow === params.id ? (
                    <GridActionsCellItem
                        icon={<CancelIcon />}
                        label="Cancel"
                        onClick={handleEditStop}
                    />
                ) : (
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => handleDeleteMeal(params.id)}
                    />
                ),
            ],
        },
    ];

    const drinkColumns = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            renderCell: (params) =>
                editingRow === params.id ? (
                    <TextField
                        size="small"
                        value={rowData.name || ''}
                        onChange={(e) => handleEditChange('name', e.target.value)}
                    />
                ) : (
                    params.value
                ),
        },
        {
            field: 'price',
            headerName: 'Price',
            flex: 1,
            renderCell: (params) =>
                editingRow === params.id ? (
                    <TextField
                        size="small"
                        value={rowData.price || ''}
                        onChange={(e) => handleEditChange('price', e.target.value)}
                    />
                ) : (
                    params.value
                ),
        },
        {
            field: 'category',
            headerName: 'Category',
            flex: 1,
            renderCell: (params) =>
                editingRow === params.id ? (
                    <FormControl size="small" fullWidth>
                        <Select
                            value={rowData.category || ''}
                            onChange={(e) => handleEditChange('category', e.target.value)}
                        >
                            <MenuItem value="spirits">Spirit</MenuItem>
                            <MenuItem value="wine">Wine</MenuItem>
                            <MenuItem value="champagne">Champagne</MenuItem>
                            <MenuItem value="cocktails (alcohol free)">Cocktails - No alcohol</MenuItem>
                            <MenuItem value="cocktails (alcohol)">Cocktails - Alcohol</MenuItem>
                            <MenuItem value="local">Local drinks</MenuItem>
                            <MenuItem value="soft drinks">Soft drinks</MenuItem>
                        </Select>
                    </FormControl>
                ) : (
                    params.value
                ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            flex: 1,
            getActions: (params) => [
                editingRow === params.id ? (
                    <GridActionsCellItem
                        icon={<SaveIcon />}
                        label="Save"
                        onClick={() => handleSaveDrink(params.id)}
                    />
                ) : (
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={() => handleEditStart(params.id, params.row)}
                    />
                ),
                editingRow === params.id ? (
                    <GridActionsCellItem
                        icon={<CancelIcon />}
                        label="Cancel"
                        onClick={handleEditStop}
                    />
                ) : (
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => handleDeleteDrink(params.id)}
                    />
                ),
            ],
        },
    ];

    return (
        <>
            <Box className="my-2 bg-white p-4 rounded-lg shadow-md text-center" sx={{ borderRadius: 1, marginBottom: 3 }}>
                <ToggleButtonGroup
                    value={activeTab}
                    exclusive
                    onChange={handleTabChange}
                    aria-label="Menu Items Toggle"
                    fullWidth
                    size='large'
                    sx={{
                        // marginBottom: 2,
                        '& .MuiToggleButton-root': {
                            fontSize: '1.6rem', // Increase font size
                            padding: '10px 10px', // Increase padding
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
            </Box>

            {activeTab === 'meals' && (
                <>
                    <Box className="my-2 bg-white p-4 rounded-lg shadow-md" sx={{ borderRadius: '4px', marginBottom: 3 }}>
                        <Stack direction="row" spacing={1}  sx={{ flexWrap: 'nowrap' }}>
                            <TextField
                                size="large"
                                fullWidth
                                value={name}
                                onChange={(e) => useMenuItemsStore.setState({ name: e.target.value })}
                                label="Name"
                                variant="outlined"
                            />
                            <TextField
                                size="large"
                                fullWidth
                                value={description}
                                onChange={(e) => useMenuItemsStore.setState({ description: e.target.value })}
                                label="Description"
                                variant="outlined"
                            />
                            <TextField
                                size="large"
                                fullWidth
                                value={price}
                                onChange={(e) => useMenuItemsStore.setState({ price: e.target.value })}
                                label="Price"
                                variant="outlined"
                            />
                            <FormControl size="large" fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={category}
                                    onChange={(e) => useMenuItemsStore.setState({ category: e.target.value })}
                                >
                                    <MenuItem value="traditional">Traditional</MenuItem>
                                    <MenuItem value="main meal">Main Meal</MenuItem>
                                    <MenuItem value="soups only">Soups Only</MenuItem>
                                    <MenuItem value="extras/sides">Extras/Sides</MenuItem>
                                    <MenuItem value="desserts">Desserts</MenuItem>
                                    <MenuItem value="starters">Starters</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant="contained" fullWidth sx={{ whiteSpace: 'nowrap' }} onClick={handleAddMeal}>
                                Add New Meal
                            </Button>
                        </Stack>
                    </Box>

                    <Box
                        className="my-2 bg-white p-4 rounded-lg shadow-md"
                        sx={{
                            borderRadius: '4px',
                            height: loadingMeals ? 200 : 1500,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {loadingMeals ? (
                            <CircularProgress />
                        ) : (
                            <DataGrid
                                rows={filteredMeals}
                                columns={mealColumns}
                                getRowId={(row) => row.id}
                                slots={{ toolbar: GridToolbar }}
                                sx={{
                                    '& .MuiDataGrid-cell': {
                                        fontSize: '1rem',
                                    },
                                    '& .MuiDataGrid-columnHeaders': {
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                    },
                                }}
                            />
                        )}
                    </Box>
                </>
            )}

            {activeTab === 'drinks' && (
                <>
                    <Box className="my-2 bg-white p-4 rounded-lg shadow-md" sx={{ borderRadius: '4px', marginBottom: 3 }}>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'nowrap' }}>
                            <TextField
                                size="large"
                                fullWidth
                                value={drink}
                                onChange={(e) => useMenuItemsStore.setState({ drink: e.target.value })}
                                label="Name"
                                variant="outlined"
                            />
                            <TextField
                                size="large"
                                fullWidth
                                value={price}
                                onChange={(e) => useMenuItemsStore.setState({ price: e.target.value })}
                                label="Price"
                                variant="outlined"
                            />
                            <FormControl size="large" fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={categoryDrinks}
                                    onChange={(e) => useMenuItemsStore.setState({ categoryDrinks: e.target.value })}
                                >
                                    <MenuItem value="spirits">Spirit</MenuItem>
                                    <MenuItem value="wine">Wine</MenuItem>
                                    <MenuItem value="champagne">Champagne</MenuItem>
                                    <MenuItem value="cocktails (alcohol free)">Cocktails - No alcohol</MenuItem>
                                    <MenuItem value="cocktails (alcohol)">Cocktails - Alcohol</MenuItem>
                                    <MenuItem value="local">Local drinks</MenuItem>
                                    <MenuItem value="soft drinks">Soft drinks</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant="contained" sx={{ whiteSpace: 'nowrap' }} onClick={handleAddDrink} fullWidth>
                                Add New Drink
                            </Button>
                        </Stack>
                    </Box>

                    <Box
                        className="my-2 bg-white p-4 rounded-lg shadow-md"
                        sx={{
                            borderRadius: '4px',
                            height: loadingDrinks ? 200 : 1500,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {loadingDrinks ? (
                            <CircularProgress />
                        ) : (
                            <DataGrid
                                rows={filteredDrinks}
                                columns={drinkColumns}
                                getRowId={(row) => row.id}
                                slots={{ toolbar: GridToolbar }}
                                sx={{
                                    '& .MuiDataGrid-cell': {
                                        fontSize: '1rem',
                                    },
                                    '& .MuiDataGrid-columnHeaders': {
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                    },
                                }}
                            />
                        )}
                    </Box>
                </>
            )}
        </>
    );
};

export default MenuItems;