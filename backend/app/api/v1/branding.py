"""Branding configuration API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import BrandConfig
from app.api.deps import get_current_tenant_id

router = APIRouter()


class BrandConfigCreate(BaseModel):
    """Brand configuration schema."""
    logo_url: str | None = None
    primary_color: str | None = None
    secondary_color: str | None = None
    font_family: str | None = None


class BrandConfigResponse(BaseModel):
    """Brand configuration response model."""
    id: int
    tenant_id: int
    logo_url: str | None
    primary_color: str | None
    secondary_color: str | None
    font_family: str | None
    
    class Config:
        from_attributes = True


@router.post("/settings", response_model=BrandConfigResponse, status_code=status.HTTP_201_CREATED)
async def save_brand_settings(
    config_data: BrandConfigCreate,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db)
):
    """
    Save or update brand settings for the restaurant.
    
    Args:
        config_data: Branding configuration
        tenant_id: Current tenant ID
        db: Database session
        
    Returns:
        BrandConfigResponse: Updated brand configuration
    """
    # Check if brand config already exists
    brand_config = db.query(BrandConfig).filter(
        BrandConfig.tenant_id == tenant_id
    ).first()
    
    if brand_config:
        # Update existing config
        for field, value in config_data.dict(exclude_unset=True).items():
            setattr(brand_config, field, value)
    else:
        # Create new config
        brand_config = BrandConfig(
            **config_data.dict(),
            tenant_id=tenant_id
        )
        db.add(brand_config)
    
    db.commit()
    db.refresh(brand_config)
    
    return brand_config


@router.get("/settings", response_model=BrandConfigResponse)
async def get_brand_settings(
    db: Session = Depends(get_db)
):
    """
    Get current brand settings for the restaurant (public endpoint).
    
    Args:
        db: Database session
        
    Returns:
        BrandConfigResponse: Current brand configuration
    """
    # For kiosk, we use default tenant_id=1
    tenant_id = 1
    brand_config = db.query(BrandConfig).filter(
        BrandConfig.tenant_id == tenant_id
    ).first()
    
    if not brand_config:
        # Return default config if none exists
        return BrandConfigResponse(
            id=0,
            tenant_id=tenant_id,
            logo_url=None,
            primary_color="#1976d2",
            secondary_color="#dc004e",
            font_family="Roboto"
        )
    
    return brand_config
