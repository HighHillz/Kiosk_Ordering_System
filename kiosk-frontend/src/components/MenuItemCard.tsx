import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    Chip,
    IconButton,
} from '@mui/material';
import { Add, LocalOffer, InfoOutlined } from '@mui/icons-material';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';

interface MenuItemCardProps {
    item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
    const { addToCart } = useCart();

    const finalPrice = item.discount_percentage
        ? Number(item.price) * (1 - item.discount_percentage / 100)
        : Number(item.price);

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {item.discount_percentage && item.discount_percentage > 0 && (
                <Chip
                    icon={<LocalOffer sx={{ fontSize: '14px !important', color: 'white' }} />}
                    label={`${item.discount_percentage}% OFF`}
                    color="error"
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 1,
                        fontWeight: 700,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                />
            )}

            <Box sx={{ position: 'relative', pt: '75%', bgcolor: '#f0f0f0' }}>
                {item.image_url ? (
                    <CardMedia
                        component="img"
                        image={`http://localhost:8000${item.image_url}`}
                        alt={item.name}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain', // Ensure full image is shown without cropping
                            p: 1, // Add small padding for "no cuts" appearance
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'text.secondary',
                        }}
                    >
                        <Typography variant="body2">No Image</Typography>
                    </Box>
                )}
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {item.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {item.dietary_tags?.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag.toUpperCase()}
                                size="small"
                                variant="outlined"
                                color={tag.toLowerCase() === 'veg' ? 'success' : 'error'}
                                sx={{ fontSize: '10px', height: 18 }}
                            />
                        ))}
                    </Box>
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '40px',
                    }}
                >
                    {item.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                    <Box>
                        {item.discount_percentage ? (
                            <>
                                <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                    ${Number(item.price).toFixed(2)}
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
                                    ${finalPrice.toFixed(2)}
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
                                ${Number(item.price).toFixed(2)}
                            </Typography>
                        )}
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<Add />}
                        onClick={() => addToCart(item)}
                        sx={{ borderRadius: 2, px: 2 }}
                    >
                        Add
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default MenuItemCard;
