import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Alert,
    Snackbar,
    Divider,
} from '@mui/material';
import { Save, Palette } from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import api from '../services/api';
import { BrandConfig } from '../types';

const SettingsPage: React.FC = () => {
    const [config, setConfig] = useState<BrandConfig>({
        logo_url: null,
        primary_color: '#6366F1',
        secondary_color: '#EC4899',
        font_family: 'Inter',
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
    const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);

    useEffect(() => {
        fetchBrandConfig();
    }, []);

    const fetchBrandConfig = async () => {
        try {
            const response = await api.get('/brand/settings');
            setConfig(response.data);
        } catch (error: any) {
            if (error.response?.status !== 404) {
                console.error('Error fetching brand config:', error);
            }
        }
    };

    const handleSave = async () => {
        try {
            await api.post('/brand/settings', config);
            setSnackbar({ open: true, message: 'Settings saved successfully!', severity: 'success' });
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.response?.data?.detail || 'Error saving settings',
                severity: 'error',
            });
        }
    };

    const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setConfig({ ...config, logo_url: response.data.url });
            setSnackbar({ open: true, message: 'Logo uploaded!', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Logo upload failed', severity: 'error' });
        }
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Branding & Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Customize your restaurant's appearance in the kiosk
            </Typography>

            <Grid container spacing={3}>
                {/* Logo Section */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Restaurant Logo
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Box sx={{ textAlign: 'center' }}>
                            {config.logo_url && (
                                <Box
                                    component="img"
                                    src={`http://localhost:8000${config.logo_url}`}
                                    alt="Logo"
                                    sx={{ maxWidth: '100%', maxHeight: 200, mb: 2, borderRadius: 2 }}
                                />
                            )}
                            <Button variant="contained" component="label" fullWidth>
                                Upload Logo
                                <input type="file" hidden accept="image/*" onChange={handleLogoUpload} />
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Theme Colors */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Palette />
                            <Typography variant="h6" fontWeight="bold">
                                Theme Colors
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Primary Color
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Box
                                    onClick={() => setShowPrimaryPicker(!showPrimaryPicker)}
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        bgcolor: config.primary_color || '#6366F1',
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        border: '2px solid #E5E7EB',
                                    }}
                                />
                                <TextField
                                    value={config.primary_color || ''}
                                    onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                                    label="Hex Code"
                                    size="small"
                                    fullWidth
                                />
                            </Box>
                            {showPrimaryPicker && (
                                <Box sx={{ position: 'absolute', zIndex: 2, mt: 1 }}>
                                    <Box
                                        onClick={() => setShowPrimaryPicker(false)}
                                        sx={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
                                    />
                                    <ChromePicker
                                        color={config.primary_color || '#6366F1'}
                                        onChange={(color) => setConfig({ ...config, primary_color: color.hex })}
                                    />
                                </Box>
                            )}
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Secondary Color
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Box
                                    onClick={() => setShowSecondaryPicker(!showSecondaryPicker)}
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        bgcolor: config.secondary_color || '#EC4899',
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        border: '2px solid #E5E7EB',
                                    }}
                                />
                                <TextField
                                    value={config.secondary_color || ''}
                                    onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                                    label="Hex Code"
                                    size="small"
                                    fullWidth
                                />
                            </Box>
                            {showSecondaryPicker && (
                                <Box sx={{ position: 'absolute', zIndex: 2, mt: 1 }}>
                                    <Box
                                        onClick={() => setShowSecondaryPicker(false)}
                                        sx={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
                                    />
                                    <ChromePicker
                                        color={config.secondary_color || '#EC4899'}
                                        onChange={(color) => setConfig({ ...config, secondary_color: color.hex })}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Font Family */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Typography
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <TextField
                            label="Font Family"
                            value={config.font_family || ''}
                            onChange={(e) => setConfig({ ...config, font_family: e.target.value })}
                            fullWidth
                            helperText="e.g., Inter, Roboto, Poppins, Arial"
                        />
                    </Paper>
                </Grid>

                {/* Preview */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, bgcolor: config.primary_color || '#6366F1', color: 'white' }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ fontFamily: config.font_family || 'Inter' }}>
                            Preview: This is how your branding will look
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ mt: 2, bgcolor: config.secondary_color, color: 'white', '&:hover': { opacity: 0.9 } }}
                        >
                            Sample Button
                        </Button>
                    </Paper>
                </Grid>

                {/* Save Button */}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Save />}
                        onClick={handleSave}
                        fullWidth
                        sx={{ py: 1.5 }}
                    >
                        Save Settings
                    </Button>
                </Grid>
            </Grid>

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

export default SettingsPage;
