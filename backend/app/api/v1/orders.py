"""Order API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from app.database import get_db
from app.models import Order, OrderItem, MenuItem, OrderStatus, PaymentStatus
from pydantic import BaseModel

router = APIRouter()

class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int
    unit_price: float

class OrderCreate(BaseModel):
    order_type: str
    payment_method: str
    total_amount: float
    items: List[OrderItemCreate]


class MenuItemMinimal(BaseModel):
    name: str
    image_url: str | None
    
    class Config:
        from_attributes = True

class OrderItemResponse(BaseModel):
    id: int
    menu_item_id: int
    quantity: int
    unit_price: float
    subtotal: float
    special_instructions: str | None = None
    menu_item: MenuItemMinimal | None = None
    
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    """Order response model."""
    id: int
    order_number: str
    total_amount: float
    status: OrderStatus
    payment_status: PaymentStatus
    created_at: datetime
    items: List[OrderItemResponse] = []
    
    class Config:
        from_attributes = True

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new customer order from the kiosk.
    """
    # For now, we use a default tenant_id = 1 (Test Restaurant)
    # In multi-tenant, this would come from the request context or URL
    tenant_id = 1
    
    # Generate a short unique order number
    order_number = str(uuid.uuid4().hex[:6]).upper()
    
    from datetime import timezone
    # Create order record
    new_order = Order(
        tenant_id=tenant_id,
        order_number=order_number,
        total_amount=order_data.total_amount,
        status=OrderStatus.PENDING,
        payment_status=PaymentStatus.PAID if order_data.payment_method != "CASH" else PaymentStatus.UNPAID,
        created_at=datetime.now(timezone.utc)
    )
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    # Create order items
    for item in order_data.items:
        order_item = OrderItem(
            order_id=new_order.id,
            menu_item_id=item.menu_item_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
            subtotal=item.quantity * item.unit_price
        )
        db.add(order_item)
    
    db.commit()

    # Push to Redis Queue for Kitchen/Workers
    try:
        from app.core.cache import cache
        queue_payload = {
            "order_id": new_order.id,
            "order_number": order_number,
            "tenant_id": tenant_id,
            "items": [item.dict() for item in order_data.items],
            "created_at": new_order.created_at.isoformat()
        }
        cache.lpush("kitchen_orders", queue_payload)
    except Exception as e:
        # Log error but don't fail the request if redis is down
        print(f"Failed to push to redis queue: {e}")
    
    return {
        "id": new_order.id,
        "order_number": order_number,
        "message": "Order placed successfully"
    }
