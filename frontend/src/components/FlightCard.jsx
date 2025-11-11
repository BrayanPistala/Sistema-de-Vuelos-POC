import React from 'react'

export default function FlightCard({ flight, onReserve }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">
            {flight.id} — {flight.origin} → {flight.dest}
          </h3>
          <p className="text-sm text-slate-600">
            Asientos disponibles: {flight.seats_available}
          </p>
        </div>
        <div>
          <button
            onClick={() => onReserve(flight.id)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reservar
          </button>
        </div>
      </div>
    </div>
  )
}
