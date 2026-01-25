import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Button,
    Container,
} from '@mui/material';
import {
    AccessTime,
    CheckCircle,
    Restaurant,
    Refresh,
} from '@mui/icons-material';
import api from '../services/api';
import { Order, OrderStatus } from '../types';

const KitchenDisplay: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchOrders = async () => {
        try {
            const response = await api.get('/admin/orders?limit=50');
            console.log('Fetched orders:', response.data); // Debug log
            // Filter ensuring we match the enum string values correctly
            const activeOrders = response.data.filter((order: Order) => {
                // Backend returns "pending" (lowercase) from Enum, check case sensitivity just in case
                const status = order.status.toLowerCase();
                return status === 'pending' || status === 'preparing';
            });
            console.log('Active orders:', activeOrders);
            setOrders(activeOrders);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (orderId: number, matchStatus: string, newStatus: string) => {
        // Optimistic update
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as OrderStatus } : o));

        try {
            // Note: need to implement status update endpoint in backend if not exists
            await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
        } catch (error) {
            console.error('Failed to update status:', error);
            // Revert on failure
            fetchOrders();
        }
    };

    const getElapsedTime = (dateString: string) => {
        const start = new Date(dateString).getTime();
        const now = new Date().getTime();
        const diff = Math.floor((now - start) / 60000); // minutes
        return diff;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'PREPARING': return 'info';
            case 'READY': return 'success';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight={700} color="text.primary">
                    Kitchen Display System
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </Typography>
                    <Button
                        startIcon={<Refresh />}
                        onClick={() => fetchOrders()}
                        variant="outlined"
                        size="small"
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {orders.length === 0 && !loading ? (
                <Box sx={{ textAlign: 'center', py: 10, opacity: 0.5 }}>
                    <CheckCircle sx={{ fontSize: 60, mb: 2, color: 'success.light' }} />
                    <Typography variant="h5">All caught up!</Typography>
                    <Typography>No active orders in queue.</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {orders.map((order) => {
                        const elapsed = getElapsedTime(order.created_at);
                        const isLate = elapsed > 15; // Highlight if waiting > 15 mins

                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={order.id}>
                                <Card
                                    elevation={3}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderTop: 6,
                                        borderColor: isLate ? 'error.main' : (order.status === 'PREPARING' ? 'info.main' : 'warning.main')
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Chip
                                                label={`#${order.order_number}`}
                                                size="small"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                            <Chip
                                                icon={<AccessTime />}
                                                label={`${elapsed} min`}
                                                color={isLate ? 'error' : 'default'}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Box>

                                        <Typography variant="h6" gutterBottom fontWeight={600}>
                                            {order.order_type === 'DINE_IN' ? 'Dine In' : 'Takeaway'}
                                        </Typography>

                                        <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                                            {order.items?.map((item, index) => (
                                                <Box key={item.id || index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, borderBottom: '1px dashed #eee', pb: 1 }}>
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {item.quantity}x {item.menu_item?.name || 'Item #' + item.menu_item_id}
                                                    </Typography>
                                                    {item.special_instructions && (
                                                        <Typography variant="caption" color="error" display="block">
                                                            Note: {item.special_instructions}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            ))}
                                            {(!order.items || order.items.length === 0) && (
                                                <Typography variant="body2" color="text.secondary">No items details available.</Typography>
                                            )}
                                        </Box>

                                    </CardContent>
                                    <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
                                        {order.status === 'PENDING' && (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="info"
                                                onClick={() => updateStatus(order.id, 'PENDING', 'PREPARING')}
                                                startIcon={<Restaurant />}
                                            >
                                                Start Preparing
                                            </Button>
                                        )}
                                        {order.status === 'PREPARING' && (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="success"
                                                onClick={() => updateStatus(order.id, 'PREPARING', 'READY')}
                                                startIcon={<CheckCircle />}
                                            >
                                                Mark Ready
                                            </Button>
                                        )}
                                    </Box>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Container>
    );
};

export default KitchenDisplay;
