from fastapi import APIRouter, HTTPException
from .models import UserCreate, UserOut
import uuid

router = APIRouter()
USERS = {}  # user_id -> {username, password}

@router.post("/users", response_model=UserOut)
def create_user(payload: UserCreate):
    user_id = str(uuid.uuid4())
    USERS[user_id] = {"username": payload.username, "password": payload.password}
    return {"id": user_id, "username": payload.username}

@router.post("/token")
def token(username: str, password: str):
    # búsqueda simple
    for uid, u in USERS.items():
        if u["username"] == username and u["password"] == password:
            return {"access_token": f"token-{uid}", "token_type": "bearer"}
    raise HTTPException(status_code=400, detail="Invalid credentials")
