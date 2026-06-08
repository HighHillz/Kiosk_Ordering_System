# Testing Guide: Kiosk Ordering System

## ✅ Services Running

### Backend API
- **URL**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/api/v1/docs
- **Status**: ✅ Running

### Admin Dashboard
- **URL**: http://localhost:3001
- **Status**: ⏳ Starting (should be ready in 10-15 seconds)

---

## Step-by-Step Testing

### 1. Create Initial Data (Backend)

Open a new terminal and run:

```bash
# Create a tenant (restaurant)
curl -X POST http://localhost:8000/api/v1/tenants \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Restaurant", "slug": "test-restaurant"}'

# Create an admin user (use tenant_id = 1 from above)
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "admin123", "tenant_id": 1}'

# Create a category
TOKEN=$(curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@test.com&password=admin123" | jq -r '.access_token')

curl -X POST http://localhost:8000/api/v1/admin/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Burgers", "display_order": 1}'
```

### 2. Test Admin Dashboard

1. **Open**: http://localhost:3001
2. **Login**:
   - Email: `admin@test.com`
   - Password: `admin123`

3. **Test Features**:
   - ✅ Add a new product (with discount)
   - ✅ Upload product image
   - ✅ Edit product
   - ✅ Delete product
   - ✅ Configure branding (Settings page)
   - ✅ Change theme colors
   - ✅ Upload logo

---

## What to Test

### Products Page
- [x] Grid view displaying products
- [x] Add new product form
- [x] Set discount percentage (0-100%)
- [x] Upload product images
- [x] Edit existing products
- [x] Delete products
- [x] Discount badges display correctly

### Settings Page
- [x] Upload restaurant logo
- [x] Pick primary color (color picker)
- [x] Pick secondary color
- [x] Font family input
- [x] Live preview of branding

---

## Known Issues / Notes

- ⚠️ **Database**: If you get database errors, ensure MySQL is running with credentials: root/root
- ⚠️ **Images**: Uploaded images are stored in `backend/uploads/tenant_1/`
- ℹ️ **First Run**: You need to create data via the curl commands above before testing the UI

---

## Stopping Services

```bash
# In the terminal running backend or frontend, press:
Ctrl+C
```

---

## Next Steps

After testing Phase 1 & 2:
- Build Phase 3: Kiosk Frontend (customer-facing interface)
- Add real-time order tracking with WebSockets
- Implement analytics dashboard
