"""Order models."""
from sqlalchemy import Column, Integer, String, DECIMAL, Enum, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class OrderStatus(str, enum.Enum):
    """Order status enumeration."""
    PENDING = "pending"
    PREPARING = "preparing"
    READY = "ready"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class PaymentStatus(str, enum.Enum):
    """Payment status enumeration."""
    UNPAID = "unpaid"
    PAID = "paid"
    REFUNDED = "refunded"

class Order(Base):
    """Order model."""
    
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    order_number = Column(String(20), unique=True, nullable=False, index=True)
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, index=True)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.UNPAID)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    """Order item model."""
    
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)
    subtotal = Column(DECIMAL(10, 2), nullable=False)
    special_instructions = Column(Text, nullable=True)

    order = relationship("Order", back_populates="items")
    menu_item = relationship("MenuItem")
