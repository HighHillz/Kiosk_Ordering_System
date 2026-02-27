import React from 'react';
import { Box, Typography, Container, AppBar, Toolbar } from '@mui/material';
import { useCustomTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
    const { brandConfig } = useCustomTheme();

    return (
        <AppBar
            position="sticky"
            elevation={2}
            sx={{
                background: `linear-gradient(90deg, ${brandConfig?.primary_color || '#6366F1'} 0%, ${brandConfig?.secondary_color || '#EC4899'} 100%)`,
                color: 'white'
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        cursor: 'pointer'
                    }}
                    onClick={() => window.location.href = '/'}
                >
                    {brandConfig?.logo_url ? (
                        <Box
                            component="img"
                            src={`http://localhost:8000${brandConfig.logo_url}`}
                            alt="Brand Logo"
                            sx={{
                                height: 50,
                                objectFit: 'contain',
                                // filter: 'brightness(0) invert(1)' // Removed to show original logo colors
                            }}
                        />
                    ) : (
                        <Typography variant="h6" fontWeight={800} color="inherit">
                            {brandConfig?.restaurant_name || 'Restaurant'}
                        </Typography>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
