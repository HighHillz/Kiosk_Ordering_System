import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';
import api from '../services/api';
import { BrandConfig } from '../types';

interface CustomThemeContextType {
    brandConfig: BrandConfig | null;
    loading: boolean;
}

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(undefined);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [brandConfig, setBrandConfig] = useState<BrandConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrandConfig = async () => {
            try {
                const response = await api.get('/brand/settings');
                setBrandConfig(response.data);
            } catch (error) {
                console.error('Error fetching brand config:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBrandConfig();
    }, []);

    const theme = createTheme({
        palette: {
            primary: {
                main: brandConfig?.primary_color || '#6366F1',
            },
            secondary: {
                main: brandConfig?.secondary_color || '#EC4899',
            },
            background: {
                default: '#F9FAFB',
            },
        },
        typography: {
            fontFamily: brandConfig?.font_family || '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: { fontWeight: 700 },
            h2: { fontWeight: 700 },
            h3: { fontWeight: 700 },
            h4: { fontWeight: 600 },
            h5: { fontWeight: 600 },
            h6: { fontWeight: 600 },
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 600,
                        padding: '12px 24px',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    },
                },
            },
        },
    });

    return (
        <CustomThemeContext.Provider value={{ brandConfig, loading }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </CustomThemeContext.Provider>
    );
};

export const useCustomTheme = () => {
    const context = useContext(CustomThemeContext);
    if (context === undefined) {
        throw new Error('useCustomTheme must be used within a CustomThemeProvider');
    }
    return context;
};
