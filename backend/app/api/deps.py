"""Dependency injection for FastAPI routes."""
from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import decode_access_token
from app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Get the current authenticated user from JWT token.
    
    Args:
        token: JWT token from Authorization header
        db: Database session
        
    Returns:
        User: Current authenticated user
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        print("DEBUG: Token decode failed")
        raise credentials_exception
    
    user_id = payload.get("sub")
    if user_id is None:
        print("DEBUG: User ID not found in token payload")
        raise credentials_exception
    
    # Convert to int if it's a string
    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        print(f"DEBUG: Invalid user_id format: {user_id}")
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        print(f"DEBUG: User not found in DB for id: {user_id}")
        raise credentials_exception
    
    return user


async def get_current_tenant_id(
    current_user: User = Depends(get_current_user)
) -> int:
    """
    Get the current tenant ID from the authenticated user.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        int: Tenant ID
    """
    return current_user.tenant_id
