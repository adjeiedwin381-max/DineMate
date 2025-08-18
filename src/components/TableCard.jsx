import React from 'react';
import { Button, Card, CardActionArea, CardActions, CardContent, Typography, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const TableCard = ({ table, handleAssign, handleOpenOccupied, isAdmin }) => {
    return (
        <Card sx={{ borderRadius: 1 }}>
            <CardActionArea onClick={() => table.status === 'available' ? handleAssign(table) : handleOpenOccupied(table)}>
                <CardContent sx={{ backgroundColor: table.status === 'available' ? '#28a745' : table.status === 'occupied' ? '#ffc107' : '#dc3545', color: '#fff', textAlign: 'center', borderRadius: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                        <Typography variant="h1" sx={{ fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.7)' }}>
                            #{table.table_no}
                        </Typography>
                        {table.status === 'occupied' && (<Typography variant="h6" sx={{ fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.7)' }}>
                            {table?.waiterName}
                        </Typography>)}
                    </Stack>
                </CardContent>
            </CardActionArea>
            {isAdmin && (<CardActions>
                <Button size="large" color="error" fullWidth startIcon={<DeleteIcon />}>
                     Delete table
                </Button>
            </CardActions>)}
        </Card>
    );
};

export default TableCard;
