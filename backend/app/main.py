"""FastAPI main application module."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.config import settings
from app.api.v1 import auth, menu, orders, tenants, admin, branding, upload

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=f"{settings.API_V1_PREFIX}/redoc",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["Authentication"])
app.include_router(menu.router, prefix=f"{settings.API_V1_PREFIX}/menu", tags=["Menu"])
app.include_router(orders.router, prefix=f"{settings.API_V1_PREFIX}/orders", tags=["Orders"])
app.include_router(tenants.router, prefix=f"{settings.API_V1_PREFIX}/tenants", tags=["Tenants"])
app.include_router(admin.router, prefix=f"{settings.API_V1_PREFIX}/admin", tags=["Admin"])
app.include_router(branding.router, prefix=f"{settings.API_V1_PREFIX}/brand", tags=["Branding"])
app.include_router(upload.router, prefix=f"{settings.API_V1_PREFIX}/upload", tags=["Upload"])

# Mount uploads directory for serving static files
upload_dir = Path("uploads")
upload_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "Kiosk Ordering System API",
        "version": settings.VERSION,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check for monitoring."""
    return {"status": "healthy"}
