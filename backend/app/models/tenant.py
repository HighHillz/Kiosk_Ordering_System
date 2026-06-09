"""Tenant model for multi-tenancy support."""
from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.sql import func
from app.database import Base
import enum


class TenantStatus(str, enum.Enum):
    """Tenant status enumeration."""
    ACTIVE = "active"
    SUSPENDED = "suspended"
    TRIAL = "trial"


class Tenant(Base):
    """Tenant (Restaurant) model."""
    
    __tablename__ = "tenants"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    status = Column(Enum(TenantStatus), default=TenantStatus.TRIAL)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
