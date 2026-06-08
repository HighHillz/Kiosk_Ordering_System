import React from 'react';
import { AppBar, Toolbar, Typography, Box, Chip } from '@mui/material';
import { AccessTime } from '@mui/icons-material';

const TopBar: React.FC = () => {
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: 'white',
                color: 'text.primary',
                borderBottom: '1px solid #E5E7EB',
            }}
        >
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    Dashboard
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                        icon={<AccessTime />}
                        label={currentTime.toLocaleTimeString()}
                        variant="outlined"
                        color="primary"
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
