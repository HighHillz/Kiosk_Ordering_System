#!/usr/bin/env python3
"""Quick setup script to create initial data."""
import sys
sys.path.insert(0, '.')

from app.database import SessionLocal
from app.models import Tenant, User, Category
from app.core.security import get_password_hash

db = SessionLocal()

try:
    # Create tenant
    print("Creating tenant...")
    tenant = db.query(Tenant).filter(Tenant.slug == "test-restaurant").first()
    if not tenant:
        tenant = Tenant(name="Test Restaurant", slug="test-restaurant", status="active")
        db.add(tenant)
        db.commit()
        db.refresh(tenant)
        print(f"✅ Tenant created: ID={tenant.id}")
    else:
        print(f"✅ Tenant already exists: ID={tenant.id}")
    
    # Create admin user
    print("Creating admin user...")
    user = db.query(User).filter(User.email == "admin@test.com").first()
    if not user:
        # Truncate password to 72 bytes for bcrypt compatibility
        password = "admin123"[:72]
        user = User(
            email="admin@test.com",
            password_hash=get_password_hash(password),
            tenant_id=tenant.id,
            role="owner"
        )
        db.add(user)
        db.commit()
        print("✅ Admin user created: admin@test.com / admin123")
    else:
        print(f"✅ Admin user already exists")
    
    # Create categories
    print("Creating categories...")
    categories = ["Burgers", "Beverages", "Sides", "Desserts"]
    for idx, cat_name in enumerate(categories, 1):
        cat = db.query(Category).filter(
            Category.tenant_id == tenant.id,
            Category.name == cat_name
        ).first()
        if not cat:
            cat = Category(
                name=cat_name,
                tenant_id=tenant.id,
                display_order=idx,
                is_active=True
            )
            db.add(cat)
    db.commit()
    print(f"✅ Categories created")
    
    print("\n🎉 Setup complete!")
    print("\nLogin credentials:")
    print("  Email: admin@test.com")
    print("  Password: admin123")
    print(f"\nOpen http://localhost:3001 to access the admin dashboard")

except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()
