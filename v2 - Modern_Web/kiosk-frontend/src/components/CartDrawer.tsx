import React from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Button,
    Divider,
    Stack,
    ButtonGroup,
} from '@mui/material';
import { Close, Add, Remove, DeleteOutline, ArrowForward } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useCustomTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
    open: boolean;
    onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
    const { cart, updateQuantity, removeFromCart, totalAmount, totalItems, orderType } = useCart();
    const { brandConfig } = useCustomTheme();
    const currencySymbol = brandConfig?.currency_symbol || '$';
    const navigate = useNavigate();

    return (
        <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 450 } } }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'primary.main', color: 'white' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h6" fontWeight={700}>Your Cart</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>({totalItems} items - {orderType})</Typography>
                    </Stack>
                    <IconButton onClick={onClose} sx={{ color: 'white' }}>
                        <Close />
                    </IconButton>
                </Box>

                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                    {cart.length === 0 ? (
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                            <Typography variant="h6">Your cart is empty</Typography>
                            <Typography variant="body2">Add some delicious items to start!</Typography>
                        </Box>
                    ) : (
                        <List disablePadding>
                            {cart.map((item) => {
                                const price = Number(item.price);
                                const discount = item.discount_percentage || 0;
                                const finalPrice = price * (1 - discount / 100);

                                return (
                                    <React.Fragment key={item.id}>
                                        <ListItem alignItems="flex-start" sx={{ px: 0, py: 2, display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', width: '100%', mb: 2 }}>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        variant="rounded"
                                                        src={`http://localhost:8000${item.image_url}`}
                                                        sx={{ width: 60, height: 60, mr: 2, bgcolor: '#f5f5f5' }}
                                                    >
                                                        {item.name[0]}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography fontWeight={700} variant="subtitle1">{item.name}</Typography>
                                                    <Typography variant="h6" color="primary.main" fontWeight={700} sx={{ mt: 0.5 }}>
                                                        {currencySymbol}{(finalPrice * item.quantity).toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pl: 9 }}>
                                                <ButtonGroup size="small" variant="outlined" color="primary">
                                                    <Button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                        <Remove fontSize="small" />
                                                    </Button>
                                                    <Button sx={{ pointerEvents: 'none', fontWeight: 700 }}>
                                                        {item.quantity}
                                                    </Button>
                                                    <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                        <Add fontSize="small" />
                                                    </Button>
                                                </ButtonGroup>
                                                <IconButton size="small" color="error" onClick={() => removeFromCart(item.id)}>
                                                    <DeleteOutline fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    )}
                </Box>

                {cart.length > 0 && (
                    <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0', bgcolor: '#f9f9f9' }}>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1" color="text.secondary">Total Amount</Typography>
                                <Typography variant="h5" fontWeight={800} color="primary.main">
                                    {currencySymbol}{totalAmount.toFixed(2)}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                endIcon={<ArrowForward />}
                                onClick={() => {
                                    onClose();
                                    navigate('/checkout');
                                }}
                                sx={{ py: 2, borderRadius: 3 }}
                            >
                                Proceed to Checkout
                            </Button>
                        </Stack>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

export default CartDrawer;
