from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import threading
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Flight Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend dev server Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class Flight(BaseModel):
    id: str
    origin: str
    dest: str
    seats_total: int
    seats_available: int

#Estos datos despues se deben guardar en una base de datos. 
FLIGHTS = {
    "FL-100": Flight(id="FL-100", origin="BOG", dest="MDE", seats_total=100, seats_available=5),
    "FL-200": Flight(id="FL-200", origin="BOG", dest="CTG", seats_total=120, seats_available=20)
}


lock = threading.Lock()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/flights", response_model=List[Flight])
def list_flights():
    return list(FLIGHTS.values())

@app.get("/flights/{flight_id}", response_model=Flight)
def get_flight(flight_id: str):
    flight = FLIGHTS.get(flight_id)
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    return flight

@app.post("/flights/{flight_id}/reserve")
def reserve_seat(flight_id: str):
    
    with lock:
        flight = FLIGHTS.get(flight_id)
        if not flight:
            raise HTTPException(status_code=404, detail="Flight not found")
        if flight.seats_available <= 0:
            raise HTTPException(status_code=409, detail="No seats available")
        flight.seats_available -= 1
        return {"status": "reserved", "flight_id": flight_id, "seats_left": flight.seats_available}

@app.post("/flights/{flight_id}/release")
def release_seat(flight_id: str):
   
    with lock:
        flight = FLIGHTS.get(flight_id)
        if not flight:
            raise HTTPException(status_code=404, detail="Flight not found")
        if flight.seats_available >= flight.seats_total:
            return {"status": "already_full", "flight_id": flight_id, "seats_left": flight.seats_available}
        flight.seats_available += 1
        return {"status": "released", "flight_id": flight_id, "seats_left": flight.seats_available}