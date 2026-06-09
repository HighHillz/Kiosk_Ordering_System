"""Menu API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from decimal import Decimal
from app.database import get_db
from app.models import MenuItem, Category
from app.api.deps import get_current_tenant_id

router = APIRouter()


class MenuItemResponse(BaseModel):
    """Menu item response model."""
    id: int
    name: str
    description: str | None
    price: Decimal
    discount_percentage: Decimal | None
    category_id: int
    image_url: str | None
    is_available: bool
    dietary_tags: list | None
    
    class Config:
        from_attributes = True


class CategoryResponse(BaseModel):
    """Category response model."""
    id: int
    name: str
    display_order: int
    is_active: bool
    
    class Config:
        from_attributes = True


@router.get("/items", response_model=List[MenuItemResponse])
async def get_menu_items(
    db: Session = Depends(get_db)
):
    """
    Get all available menu items (public endpoint for kiosk).
    
    Args:
        db: Database session
        
    Returns:
        List[MenuItemResponse]: List of available menu items
    """
    # For now, return items from all tenants (or filter by tenant in production)
    items = db.query(MenuItem).filter(
        MenuItem.is_available == True
    ).all()
    
    return items


@router.get("/categories", response_model=List[CategoryResponse])
async def get_categories(
    db: Session = Depends(get_db)
):
    """
    Get all categories (public endpoint for kiosk).
    
    Args:
        db: Database session
        
    Returns:
        List[CategoryResponse]: List of categories
    """
    categories = db.query(Category).filter(
        Category.is_active == True
    ).order_by(Category.display_order).all()
    
    return categories
