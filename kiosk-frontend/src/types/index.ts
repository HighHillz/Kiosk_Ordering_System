export interface MenuItem {
    id: number;
    name: string;
    description: string | null;
    price: number;
    discount_percentage: number | null;
    category_id: number;
    image_url: string | null;
    is_available: boolean;
    dietary_tags: string[] | null;
}

export interface Category {
    id: number;
    name: string;
    display_order: number;
    is_active: boolean;
}

export interface BrandConfig {
    restaurant_name?: string | null;
    logo_url: string | null;
    primary_color: string | null;
    secondary_color: string | null;
    font_family: string | null;
}

export interface CartItem extends MenuItem {
    quantity: number;
}

export type OrderType = 'DINE_IN' | 'TAKEAWAY';
