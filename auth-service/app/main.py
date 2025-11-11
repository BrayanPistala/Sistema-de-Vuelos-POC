from fastapi import FastAPI
from .routes import router as user_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Auth Service")
app.include_router(user_router, prefix="/auth")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend dev server Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
