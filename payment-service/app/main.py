from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
import random
import time
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Payment Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend dev server Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class PaymentReq(BaseModel):
    booking_id: str
    amount: float


PAYMENTS: Dict[str, Dict] = {}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/pay")
def pay(req: PaymentReq):
      
    time.sleep(0.2)
    
    fail_chance = 0.0  
    if random.random() < fail_chance:
        PAYMENTS[req.booking_id] = {"status": "failed", "amount": req.amount}
        raise HTTPException(status_code=402, detail="Payment failed (simulated)")
    PAYMENTS[req.booking_id] = {"status": "ok", "amount": req.amount}
    return {"status": "ok", "booking_id": req.booking_id}
