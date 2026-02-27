import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    Divider,
    Button,
} from '@mui/material';
import {
    Restaurant,
    Settings,
    Logout,
    ShoppingCart,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 260;

interface SidebarProps {
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Products', icon: <Restaurant />, path: '/products' },
        // { text: 'Orders', icon: <ShoppingCart />, path: '/orders' },
        { text: 'Kitchen Display', icon: <ShoppingCart />, path: '/kitchen' },
        { text: 'Settings', icon: <Settings />, path: '/settings' },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    bgcolor: '#1E293B',
                    color: 'white',
                },
            }}
        >
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Restaurant sx={{ fontSize: 40, color: '#6366F1', mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                    Restaurant Admin
                </Typography>
            </Box>

            <Divider sx={{ borderColor: '#334155' }} />

            <List sx={{ flexGrow: 1, mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ px: 2, mb: 1 }}>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            selected={location.pathname === item.path}
                            sx={{
                                borderRadius: 2,
                                '&.Mui-selected': {
                                    bgcolor: '#6366F1',
                                    '&:hover': {
                                        bgcolor: '#5558E3',
                                    },
                                },
                                '&:hover': {
                                    bgcolor: '#334155',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ p: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Logout />}
                    onClick={onLogout}
                    sx={{
                        color: 'white',
                        borderColor: '#475569',
                        '&:hover': {
                            borderColor: '#EC4899',
                            bgcolor: 'rgba(236, 72, 153, 0.1)',
                        },
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
