import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { Restaurant, CardGiftcard } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useCustomTheme } from '../context/ThemeContext';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { setOrderType } = useCart();
    const { brandConfig } = useCustomTheme();

    const handleSelection = (type: 'DINE_IN' | 'TAKEAWAY') => {
        setOrderType(type);
        navigate('/menu');
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header is optional on Landing Page but good for consistency? 
                Actually, Landing Page design is full screen gradient usually. 
                Let's KEEP the full screen gradient design but maybe add a small header or just logo.
                The USER asked for "brand logo should show every screen". 
                The current Landing Page DOES show the logo in the center. 
                Replacing it with the standard Header might ruin the 'Splash Screen' feel.
                
                However, to strictly follow "Colours and theme to applied on all screen", 
                let's ensure the header is available or the logo is prominent.
                
                The current implementation:
                     <Box
                            component="img"
                            src={`http://localhost:8000${brandConfig.logo_url}`} ... />
                shows the logo. This satisfies "brand logo should show every screen".
                
                I will NOT add the standard top bar Header here because it conflicts with the centered splash design.
                I WILL ensure the colors are applied correctly (which they are via brandConfig).
            */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${brandConfig?.primary_color || '#6366F1'} 0%, ${brandConfig?.secondary_color || '#EC4899'} 100%)`,
                    color: 'white',
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        {brandConfig?.logo_url && (
                            <Box
                                component="img"
                                src={`http://localhost:8000${brandConfig.logo_url}`}
                                alt="Logo"
                                sx={{ height: 120, mb: 4, objectFit: 'contain' }}
                            />
                        )}
                        <Typography variant="h2" gutterBottom sx={{ fontWeight: 800 }}>
                            Welcome to {brandConfig?.restaurant_name || 'Our Restaurant'}
                        </Typography>
                        <Typography variant="h5" sx={{ opacity: 0.9 }}>
                            Please select your order type to begin
                        </Typography>
                    </Box>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="center">
                        <Button
                            variant="contained"
                            onClick={() => handleSelection('DINE_IN')}
                            sx={{
                                width: { xs: '100%', sm: 300 },
                                height: 300,
                                flexDirection: 'column',
                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                                    transform: 'scale(1.02)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <Restaurant sx={{ fontSize: 80, mb: 2 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                Dine In
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
                                Eat here at the restaurant
                            </Typography>
                        </Button>

                        <Button
                            variant="contained"
                            onClick={() => handleSelection('TAKEAWAY')}
                            sx={{
                                width: { xs: '100%', sm: 300 },
                                height: 300,
                                flexDirection: 'column',
                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                                    transform: 'scale(1.02)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <CardGiftcard sx={{ fontSize: 80, mb: 2 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                Takeaway
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
                                Order to go
                            </Typography>
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;
