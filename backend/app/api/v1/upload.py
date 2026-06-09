"""File upload API endpoints."""
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from pathlib import Path
import shutil
import uuid
from pydantic import BaseModel
from app.api.deps import get_current_tenant_id

router = APIRouter()

# Configure upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


class UploadResponse(BaseModel):
    """File upload response model."""
    filename: str
    url: str


@router.post("/image", response_model=UploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    tenant_id: int = Depends(get_current_tenant_id)
):
    """
    Upload an image file (for menu items or branding).
    
    Args:
        file: Uploaded file
        tenant_id: Current tenant ID
        
    Returns:
        UploadResponse: Uploaded file details with URL
    """
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    
    # Create tenant-specific directory
    tenant_dir = UPLOAD_DIR / f"tenant_{tenant_id}"
    tenant_dir.mkdir(exist_ok=True)
    
    file_path = tenant_dir / unique_filename
    
    # Save file
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving file: {str(e)}"
        )
    finally:
        file.file.close()
    
    # Generate URL (in production, this would be a CDN URL)
    file_url = f"/uploads/tenant_{tenant_id}/{unique_filename}"
    
    return UploadResponse(
        filename=unique_filename,
        url=file_url
    )


@router.delete("/image/{filename}")
async def delete_image(
    filename: str,
    tenant_id: int = Depends(get_current_tenant_id)
):
    """
    Delete an uploaded image.
    
    Args:
        filename: Name of the file to delete
        tenant_id: Current tenant ID
        
    Returns:
        dict: Success message
    """
    file_path = UPLOAD_DIR / f"tenant_{tenant_id}" / filename
    
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    try:
        file_path.unlink()
        return {"message": "File deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting file: {str(e)}"
        )
