import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Switch,
    FormControlLabel,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    ImageOutlined,
    LocalOffer,
} from '@mui/icons-material';
import api from '../services/api';
import { MenuItem as MenuItemType } from '../types';

const ProductsPage: React.FC = () => {
    const [items, setItems] = useState<MenuItemType[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const [formData, setFormData] = useState<MenuItemType>({
        name: '',
        description: '',
        price: 0,
        discount_percentage: 0,
        category_id: 1,
        image_url: null,
        is_available: true,
        dietary_tags: [],
    });

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await api.get('/menu/items');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/menu/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleOpenDialog = (item?: MenuItemType) => {
        if (item) {
            setEditingItem(item);
            setFormData(item);
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                description: '',
                price: 0,
                discount_percentage: 0,
                category_id: categories[0]?.id || 1,
                image_url: null,
                is_available: true,
                dietary_tags: [],
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingItem(null);
    };

    const handleSubmit = async () => {
        try {
            if (editingItem) {
                await api.put(`/admin/menu/items/${editingItem.id}`, formData);
                setSnackbar({ open: true, message: 'Item updated successfully!', severity: 'success' });
            } else {
                await api.post('/admin/menu/items', formData);
                setSnackbar({ open: true, message: 'Item created successfully!', severity: 'success' });
            }
            handleCloseDialog();
            fetchItems();
        } catch (error: any) {
            setSnackbar({ open: true, message: error.response?.data?.detail || 'Error saving item', severity: 'error' });
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/admin/menu/items/${id}`);
                setSnackbar({ open: true, message: 'Item deleted successfully!', severity: 'success' });
                fetchItems();
            } catch (error) {
                setSnackbar({ open: true, message: 'Error deleting item', severity: 'error' });
            }
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const response = await api.post('/upload/image', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setFormData({ ...formData, image_url: response.data.url });
            setSnackbar({ open: true, message: 'Image uploaded!', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Image upload failed', severity: 'error' });
        }
    };

    const calculateDiscountedPrice = (price: number, discount: number | null) => {
        if (!discount) return price;
        return price * (1 - discount / 100);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                    Menu Products
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    size="large"
                >
                    Add Product
                </Button>
            </Box>

            <Grid container spacing={3}>
                {items.map((item) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            {item.discount_percentage && item.discount_percentage > 0 && (
                                <Chip
                                    icon={<LocalOffer fontSize="small" />}
                                    label={`${item.discount_percentage}% OFF`}
                                    color="error"
                                    size="small"
                                    sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1, fontWeight: 'bold' }}
                                />
                            )}
                            {item.image_url ? (
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={`http://localhost:8000${item.image_url}`}
                                    alt={item.name}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        height: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: '#F3F4F6',
                                    }}
                                >
                                    <ImageOutlined sx={{ fontSize: 60, color: '#9CA3AF' }} />
                                </Box>
                            )}
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {item.description || 'No description'}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                    {item.dietary_tags?.map((tag) => (
                                        <Chip key={tag} label={tag} size="small" variant="outlined" color="success" />
                                    ))}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {item.discount_percentage && item.discount_percentage > 0 ? (
                                        <>
                                            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                                ${item.price}
                                            </Typography>
                                            <Typography variant="h6" color="error" fontWeight="bold">
                                                ${calculateDiscountedPrice(Number(item.price), item.discount_percentage).toFixed(2)}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography variant="h6" fontWeight="bold" color="primary">
                                            ${item.price}
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                            <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB' }}>
                                <IconButton onClick={() => handleOpenDialog(item)} color="primary">
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(item.id!)} color="error">
                                    <Delete />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Create/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingItem ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Product Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            multiline
                            rows={3}
                            fullWidth
                        />
                        <TextField
                            label="Price ($)"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                            required
                            fullWidth
                            inputProps={{ step: 0.01 }}
                        />
                        <TextField
                            label="Discount (%)"
                            type="number"
                            value={formData.discount_percentage}
                            onChange={(e) =>
                                setFormData({ ...formData, discount_percentage: parseFloat(e.target.value) || 0 })
                            }
                            fullWidth
                            inputProps={{ min: 0, max: 100 }}
                            helperText="Enter 0-100 for percentage discount"
                        />
                        <TextField
                            select
                            label="Category"
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                            fullWidth
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Box>
                            <Button variant="outlined" component="label" fullWidth>
                                Upload Image
                                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                            </Button>
                            {formData.image_url && (
                                <>
                                    <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                                        ✓ Image uploaded successfully!
                                    </Typography>
                                    <Box
                                        sx={{
                                            mt: 2,
                                            border: '2px dashed #E0E0E0',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            maxHeight: 200,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            bgcolor: '#FAFAFA',
                                            p: 1,
                                        }}
                                    >
                                        <img
                                            src={`http://localhost:8000${formData.image_url}`}
                                            alt="Preview"
                                            style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain' }}
                                        />
                                    </Box>
                                </>
                            )}
                        </Box>
                        <TextField
                            label="Dietary Tags (comma-separated)"
                            value={formData.dietary_tags?.join(', ') || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, dietary_tags: e.target.value.split(',').map((t) => t.trim()) })
                            }
                            fullWidth
                            helperText="e.g., veg, non-veg, gluten-free"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.is_available}
                                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                                    color="primary"
                                />
                            }
                            label="Available for Order"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingItem ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProductsPage;
