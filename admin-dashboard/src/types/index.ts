export interface MenuItem {
    id?: number;
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
    is_available: boolean;
}

export interface BrandConfig {
    id?: number;
    tenant_id?: number;
    logo_url: string | null;
    primary_color: string | null;
    secondary_color: string | null;
    font_family: string | null;
}

export interface User {
    email: string;
    tenant_id: number;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
    id: number;
    menu_item_id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
    special_instructions?: string;
    menu_item?: {
        name: string;
        image_url: string | null;
    };
}

export interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    status: OrderStatus;
    payment_status: string;
    created_at: string;
    items?: OrderItem[];
    order_type: 'DINE_IN' | 'TAKEAWAY';
}
