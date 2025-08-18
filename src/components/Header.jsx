import React from 'react';
import { Typography, Box } from '@mui/material';
import dayjs from 'dayjs';
import { useState, useEffect } from "react";

const Header = ({ title }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const formatDate = (date) => {
        return dayjs(date).format('DD MMMM YYYY, h:mm:ss A');
    };

    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} sx={{ backgroundColor: '#fff', padding: 2, borderRadius: 4 }}>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="h6">{formatDate(currentTime)}</Typography>
        </Box>
    );
}

export default Header;