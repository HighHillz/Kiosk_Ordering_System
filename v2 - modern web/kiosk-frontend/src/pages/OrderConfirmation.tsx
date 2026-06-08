import React from 'react';
import { Box, Typography, Button, Container, Paper, Stack } from '@mui/material';
import { CheckCircleOutline, Receipt, Home } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';

const OrderConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderNumber = location.state?.orderNumber || '000000';

    return (
        <Box>
            <Header />
            <Container maxWidth="sm" sx={{ py: 10 }}>
                <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 6, bgcolor: '#fbfbfb', border: '1px solid #eee' }}>
                    <CheckCircleOutline sx={{ fontSize: 100, color: 'success.main', mb: 3 }} />
                    <Typography variant="h3" fontWeight={800} gutterBottom>Thank You!</Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                        Your order has been placed successfully.
                    </Typography>

                    <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 4, border: '2px dashed #e0e0e0', mb: 6 }}>
                        <Typography variant="overline" color="text.secondary">Order Number</Typography>
                        <Typography variant="h2" fontWeight={900} color="primary.main">
                            #{orderNumber}
                        </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 6, opacity: 0.8 }}>
                        Please take your token and wait for your number to be called.<br />
                        Estimated wait time: 10-15 minutes.
                    </Typography>

                    <Stack direction="column" spacing={2}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Home />}
                            onClick={() => navigate('/')}
                            sx={{ py: 2, borderRadius: 3, fontWeight: 700 }}
                        >
                            Back to Home
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<Receipt />}
                            sx={{ py: 1.5, borderRadius: 3 }}
                        >
                            Print Receipt
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};

export default OrderConfirmation;
