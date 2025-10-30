from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
import random
import time

app = FastAPI(title="Payment Service")

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
