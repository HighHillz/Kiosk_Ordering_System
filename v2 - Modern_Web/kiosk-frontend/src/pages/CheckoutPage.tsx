import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Stack,
    Divider,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Paper,
    IconButton,
} from '@mui/material';
import {
    ArrowBack,
    CreditCard,
    AccountBalance,
    QrCode,
    Payments,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import Header from '../components/layout/Header';

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { cart, totalAmount, orderType, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('CARD');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitOrder = async () => {
        setIsSubmitting(true);
        try {
            const orderData = {
                order_type: orderType,
                payment_method: paymentMethod,
                total_amount: totalAmount,
                items: cart.map(item => ({
                    menu_item_id: item.id,
                    quantity: item.quantity,
                    unit_price: Number(item.price) * (1 - (item.discount_percentage || 0) / 100)
                }))
            };

            const response = await api.post('/orders', orderData);
            clearCart();
            // Assuming response contains order_number
            navigate('/confirmation', { state: { orderNumber: response.data.order_number } });
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    React.useEffect(() => {
        if (cart.length === 0) {
            navigate('/menu');
        }
    }, [cart, navigate]);

    if (cart.length === 0) {
        return null;
    }

    return (
        <Box>
            <Header />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => navigate('/menu')} sx={{ mr: 2 }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4" fontWeight={800}>Checkout</Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Typography variant="h6" gutterBottom fontWeight={700}>Select Payment Method</Typography>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                            <FormControl component="fieldset" fullWidth>
                                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                    <Stack spacing={2}>
                                        {[
                                            { value: 'CARD', label: 'Credit / Debit Card', icon: <CreditCard /> },
                                            { value: 'UPI', label: 'UPI (GPay, PhonePe)', icon: <QrCode /> },
                                            { value: 'NETBANKING', label: 'Net Banking', icon: <AccountBalance /> },
                                            { value: 'CASH', label: 'Pay at Counter', icon: <Payments /> },
                                        ].map((method) => (
                                            <Paper
                                                key={method.value}
                                                variant="outlined"
                                                sx={{
                                                    p: 1,
                                                    borderRadius: 2,
                                                    borderColor: paymentMethod === method.value ? 'primary.main' : 'divider',
                                                    bgcolor: paymentMethod === method.value ? 'primary.50' : 'transparent',
                                                }}
                                            >
                                                <FormControlLabel
                                                    value={method.value}
                                                    control={<Radio />}
                                                    label={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            {method.icon}
                                                            <Typography fontWeight={600}>{method.label}</Typography>
                                                        </Box>
                                                    }
                                                    sx={{ width: '100%', m: 0, py: 1 }}
                                                />
                                            </Paper>
                                        ))}
                                    </Stack>
                                </RadioGroup>
                            </FormControl>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }}>
                        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 4, bgcolor: '#fbfbfb' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom fontWeight={700}>Order Summary</Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Type: {orderType === 'DINE_IN' ? 'Dine In' : 'Takeaway'}
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Stack spacing={1.5}>
                                    {cart.map((item) => (
                                        <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">
                                                {item.quantity}x {item.name}
                                            </Typography>
                                            <Typography variant="body2" fontWeight={600}>
                                                ${(Number(item.price) * (1 - (item.discount_percentage || 0) / 100) * item.quantity).toFixed(2)}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>

                                <Divider sx={{ my: 2.5 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                    <Typography variant="h6" fontWeight={700}>Total</Typography>
                                    <Typography variant="h5" fontWeight={800} color="primary.main">
                                        ${totalAmount.toFixed(2)}
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    onClick={handleSubmitOrder}
                                    disabled={isSubmitting}
                                    sx={{ py: 2, borderRadius: 3, fontWeight: 700 }}
                                >
                                    {isSubmitting ? 'Processing...' : 'Place Order'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default CheckoutPage;
