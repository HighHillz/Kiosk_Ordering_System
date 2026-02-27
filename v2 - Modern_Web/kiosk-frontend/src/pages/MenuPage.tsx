import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Tabs,
    Tab,
    CircularProgress,
    Toolbar,
    ToggleButton,
    ToggleButtonGroup,
    Fab,
    Badge,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import api from '../services/api';
import { MenuItem, Category } from '../types';
import MenuItemCard from '../components/MenuItemCard';
import { useCart } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';
import Header from '../components/layout/Header';

const MenuPage: React.FC = () => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCategory, setActiveCategory] = useState<number>(0);
    const [dietaryFilter, setDietaryFilter] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { totalItems } = useCart();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [itemsRes, catRes] = await Promise.all([
                    api.get('/menu/items'),
                    api.get('/menu/categories'),
                ]);
                setItems(itemsRes.data);
                setCategories(catRes.data);
                if (catRes.data.length > 0) {
                    setActiveCategory(catRes.data[0].id);
                }
            } catch (error) {
                console.error('Error fetching menu:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredItems = items.filter((item) => {
        const matchesCategory = item.category_id === activeCategory;
        const matchesDietary =
            dietaryFilter === 'all' ||
            item.dietary_tags?.some((tag) => tag.toLowerCase() === dietaryFilter);
        return matchesCategory && matchesDietary;
    });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ pb: 10 }}>
            <Header />
            <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 1100 }}>
                <Toolbar sx={{ flexDirection: 'column', py: 1 }}>
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                            Explore Our Menu
                        </Typography>
                        <ToggleButtonGroup
                            size="small"
                            value={dietaryFilter}
                            exclusive
                            onChange={(_, val) => val && setDietaryFilter(val)}
                            aria-label="dietary filter"
                        >
                            <ToggleButton value="all">All</ToggleButton>
                            <ToggleButton value="veg" color="success">Veg</ToggleButton>
                            <ToggleButton value="non-veg" color="error">Non-Veg</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    <Tabs
                        value={activeCategory}
                        onChange={(_, val) => setActiveCategory(val)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ width: '100%' }}
                    >
                        {categories.map((cat) => (
                            <Tab key={cat.id} label={cat.name} value={cat.id} sx={{ fontWeight: 600 }} />
                        ))}
                    </Tabs>
                </Toolbar>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Grid container spacing={3}>
                    {filteredItems.map((item) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
                            <MenuItemCard item={item} />
                        </Grid>
                    ))}
                    {filteredItems.length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" color="text.secondary">
                                No items found in this category.
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Container>

            <Fab
                color="primary"
                aria-label="cart"
                sx={{ position: 'fixed', bottom: 32, right: 32 }}
                onClick={() => setIsCartOpen(true)}
            >
                <Badge badgeContent={totalItems} color="error">
                    <ShoppingCart />
                </Badge>
            </Fab>

            <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </Box>
    );
};

export default MenuPage;
