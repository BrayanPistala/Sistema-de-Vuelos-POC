from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uuid
import os
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Booking Service")

FLIGHT_SERVICE_URL = os.environ.get("FLIGHT_SERVICE_URL", "http://flight-service:8001")
PAYMENT_SERVICE_URL = os.environ.get("PAYMENT_SERVICE_URL", "http://payment-service:8004")

bookings = {}  

class BookingRequest(BaseModel):
    user_id: str
    flight_id: str
    amount: float

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/book")
def book(req: BookingRequest):
    """
    Flujo simplificado:
      1. Reservar asiento (flight-service /reserve)
      2. Procesar pago (payment-service /pay)
      3. Confirmar booking
    Si el pago falla, se compensa liberando el asiento (se llama /release).
    """
    booking_id = str(uuid.uuid4())
    bookings[booking_id] = {"status": "pending", "user_id": req.user_id, "flight_id": req.flight_id, "amount": req.amount}
    # Se reservará el asiento
    try:
        r = requests.post(f"{FLIGHT_SERVICE_URL}/flights/{req.flight_id}/reserve", timeout=5)
        r.raise_for_status()
    except Exception as e:
        bookings[booking_id]["status"] = "seat_reservation_failed"
        raise HTTPException(status_code=400, detail=f"Seat reservation failed: {e}")

    # Se realizará el pago
    try:
        pay = requests.post(f"{PAYMENT_SERVICE_URL}/pay", json={"booking_id": booking_id, "amount": req.amount}, timeout=8)
        pay.raise_for_status()
    except Exception as e:
        bookings[booking_id]["status"] = "payment_failed"
        # Se libera el asiento
        try:
            requests.post(f"{FLIGHT_SERVICE_URL}/flights/{req.flight_id}/release", timeout=5)
        except Exception as e2:
           
            bookings[booking_id]["compensation_error"] = str(e2)
        raise HTTPException(status_code=400, detail=f"Payment failed, booking cancelled: {e}")

    #Se confirma
    bookings[booking_id]["status"] = "confirmed"
    return {"booking_id": booking_id, "status": "confirmed", "flight_id": req.flight_id}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend dev server Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
