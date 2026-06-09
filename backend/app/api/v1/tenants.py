"""Tenant management API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import Tenant, TenantStatus

router = APIRouter()


class TenantCreate(BaseModel):
    """Tenant creation schema."""
    name: str
    slug: str


class TenantResponse(BaseModel):
    """Tenant response model."""
    id: int
    name: str
    slug: str
    status: TenantStatus
    
    class Config:
        from_attributes = True


@router.post("/", response_model=TenantResponse, status_code=status.HTTP_201_CREATED)
async def create_tenant(
    tenant_data: TenantCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new tenant.
    
    Args:
        tenant_data: Tenant creation data
        db: Database session
        
    Returns:
        TenantResponse: Created tenant
    """
    # Check if slug already exists
    existing_tenant = db.query(Tenant).filter(Tenant.slug == tenant_data.slug).first()
    if existing_tenant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tenant with this slug already exists"
        )
    
    new_tenant = Tenant(**tenant_data.dict())
    db.add(new_tenant)
    db.commit()
    db.refresh(new_tenant)
    
    return new_tenant


@router.get("/{tenant_id}", response_model=TenantResponse)
async def get_tenant(
    tenant_id: int,
    db: Session = Depends(get_db)
):
    """
    Get tenant by ID.
    
    Args:
        tenant_id: Tenant ID
        db: Database session
        
    Returns:
        TenantResponse: Tenant details
    """
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    return tenant
