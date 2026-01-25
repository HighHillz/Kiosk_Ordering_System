from app.database import SessionLocal
from app.models import BrandConfig

db = SessionLocal()
config = db.query(BrandConfig).filter(BrandConfig.tenant_id == 1).first()
if config:
    print(f"Found config: {config.id}, Logo: {config.logo_url}")
else:
    print("No brand config found for tenant 1")
