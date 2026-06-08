"""Admin API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from decimal import Decimal
from app.database import get_db
from app.models import Order, MenuItem, Category, OrderStatus
from app.api.deps import get_current_tenant_id
from app.api.v1.orders import OrderResponse
from app.api.v1.menu import MenuItemResponse

router = APIRouter()


class MenuItemCreate(BaseModel):
    """Menu item creation schema."""
    name: str
    description: str | None = None
    price: Decimal
    discount_percentage: Decimal | None = 0
    category_id: int
    image_url: str | None = None
    dietary_tags: list | None = None


class CategoryCreate(BaseModel):
    """Category creation schema."""
    name: str
    display_order: int = 0


class OrderStatusUpdate(BaseModel):
    """Order status update schema."""
    status: OrderStatus


@router.get("/orders", response_model=List[OrderResponse])
async def list_orders(
    skip: int = 0,
    limit: int = 50,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db)
):
    """
    List all orders for the tenant (paginated).
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        tenant_id: Current tenant ID
        db: Database session
        
    Returns:
        List[OrderResponse]: List of orders
    """
    from sqlalchemy.orm import joinedload
    from app.models import OrderItem
    
    orders = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.menu_item)
    ).filter(
        Order.tenant_id == tenant_id
    ).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    
    return orders


@router.patch("/orders/{order_id}/status")
async def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db)
):
    """
    Update order status.
    
    Args:
        order_id: Order ID
        status_update: New status
        tenant_id: Current tenant ID
        db: Database session
        
    Returns:
        dict: Success message
    """
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.tenant_id == tenant_id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    order.status = status_update.status
    db.commit()
    
    return {"message": "Order status updated successfully"}


@router.post("/menu/items", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
async def create_menu_item(
    item_data: MenuItemCreate,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db)
):
    """
    Create a new menu item.
    
    Args:
        item_data: Menu item data
        tenant_id: Current tenant ID
        db: Database session
        
    Returns:
        MenuItemResponse: Created menu item
    """
    new_item = MenuItem(
        **item_data.dict(),
        tenant_id=tenant_id
    )
    
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    
    return new_item


class MenuItemUpdate(BaseModel):
    """Menu item update schema."""
    name: str | None = None
    description: str | None = None
    price: Decimal | None = None
    discount_percentage: Decimal | None = None
    category_id: int | None = None
    image_url: str | None = None
    is_available: bool | None = None
    dietary_tags: list | None = None


@router.put("/menu/items/{item_id}", response_model=MenuItemResponse)
async def update_menu_item(
    item_id: int,
    item_data: MenuItemUpdate,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db)
):
    """
    Update a menu item.
    
    Args:
        item_id: Menu item ID
        item_data: Updated menu item data
        tenant_id: Current tenant ID
        db: Database session
        
    Returns:
        MenuItemResponse: Updated menu item
    """
    item = db.query(MenuItem).filter(
        MenuItem.id == item_id,
        MenuItem.tenant_id == tenant_id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )
    
    update_data = item_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
    
    db.commit()
    db.refresh(item)
    
    return item


@router.delete("/menu/items/{item_id}")
async def delete_menu_item(
    item_id: int,
    tenant_id: int = Depends(get_current_tenant_id),
    db: Session = Depends(get_db)
):
    """
    Delete a menu item.
    
    Args:
        item_id: Menu item ID
        tenant_id: Current tenant ID
        db: Database session
        
    Returns:
        dict: Success message
    """
    item = db.query(MenuItem).filter(
        MenuItem.id == item_id,
        MenuItem.tenant_id == tenant_id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )
    
    db.delete(item)
    db.commit()
    
    return {"message": "Menu item deleted successfully"}
