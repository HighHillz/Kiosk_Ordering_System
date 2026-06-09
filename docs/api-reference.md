# Backend API Documentation

## Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://your-domain.com`

## Authentication

All admin endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

---

## API Endpoints

### Authentication

#### POST `/api/v1/auth/login`
Login and get access token.

**Request:**
```json
{
  "username": "admin@restaurant.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

#### POST `/api/v1/auth/register`
Register a new user (admin account).

**Request:**
```json
{
  "email": "admin@restaurant.com",
  "password": "password123",
  "tenant_id": 1
}
```

---

### Menu (Public - No Auth Required for Kiosk)

#### GET `/api/v1/menu/items`
Get all available menu items.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Cheese Burger",
    "description": "Classic burger with cheese",
    "price": 9.99,
    "category_id": 1,
    "image_url": "https://...",
    "is_available": true,
    "dietary_tags": ["non-veg"]
  }
]
```

#### GET `/api/v1/menu/categories`
Get all categories.

---

### Orders

#### POST `/api/v1/orders`
Create a new order.

**Request:**
```json
{
  "items": [
    {
      "menu_item_id": 1,
      "quantity": 2,
      "special_instructions": "No onions"
    }
  ]
}
```

**Response:**
```json
{
  "id": 1,
  "order_number": "KIO-1706180234",
  "total_amount": 19.98,
  "status": "pending",
  "payment_status": "unpaid",
  "created_at": "2024-01-25T10:30:00Z",
  "items": [...]
}
```

#### GET `/api/v1/orders/{order_number}`
Get order details by order number.

---

### Admin (Requires Authentication)

#### GET `/api/v1/admin/orders`
List all orders (paginated).

**Query Parameters:**
- `skip`: Number of records to skip (default: 0)
- `limit`: Max records to return (default: 50)

#### PATCH `/api/v1/admin/orders/{order_id}/status`
Update order status.

**Request:**
```json
{
  "status": "preparing"
}
```

**Status Values:** `pending`, `preparing`, `ready`, `completed`, `cancelled`

#### POST `/api/v1/admin/menu/items`
Create a new menu item.

**Request:**
```json
{
  "name": "Veggie Burger",
  "description": "Plant-based burger",
  "price": 8.99,
  "category_id": 1,
  "image_url": "https://...",
  "dietary_tags": ["veg", "healthy"]
}
```

#### DELETE `/api/v1/admin/menu/items/{item_id}`
Delete a menu item.

---

### Tenants

#### POST `/api/v1/tenants`
Create a new tenant (restaurant).

**Request:**
```json
{
  "name": "My Restaurant",
  "slug": "my-restaurant"
}
```

#### GET `/api/v1/tenants/{tenant_id}`
Get tenant details.

---

## Error Responses

All API errors follow this format:

```json
{
  "detail": "Error message here"
}
```

**Common Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

---

## Interactive Documentation

Visit `http://localhost:8000/api/v1/docs` for interactive Swagger UI documentation.
