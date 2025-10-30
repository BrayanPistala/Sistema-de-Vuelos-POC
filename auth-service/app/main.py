from fastapi import FastAPI
from .routes import router as user_router

app = FastAPI(title="Auth Service")
app.include_router(user_router, prefix="/auth")
