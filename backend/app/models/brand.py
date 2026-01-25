"""Branding configuration model."""
from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class BrandConfig(Base):
    """Brand configuration model for tenant customization."""
    
    __tablename__ = "brand_config"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, unique=True)
    logo_url = Column(String(255))
    primary_color = Column(String(7))  # Hex color like #FF5733
    secondary_color = Column(String(7))
    font_family = Column(String(50))
