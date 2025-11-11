import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CreditCard, Calendar, MapPin, Users, Search, Wallet } from 'lucide-react'


const API = {
  FLIGHTS: import.meta.env.VITE_API_FLIGHTS || 'http://localhost:8001',
  BOOKINGS: import.meta.env.VITE_API_BOOKINGS || 'http://localhost:8002',
  PAYMENTS: import.meta.env.VITE_API_PAYMENTS || 'http://localhost:8004',
}


function IconButton({ icon: Icon, label }) {
  return (
    <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg shadow-sm">
      <Icon size={18} />
      <span className="text-sm">{label}</span>
  </button>
  )
}


function FlightCard({ flight, onReserve }) {
  return (
  <div className="bg-white/5 p-4 rounded-xl shadow-md flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
    <div className="flex gap-4 items-center">
      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white font-semibold">{flight.id.split('-').pop()}</div>
      <div>
        <div className="text-lg font-semibold text-white">{flight.origin} → {flight.dest}</div>
        <div className="text-sm text-slate-300">{flight.departure || '08:00'} · {flight.duration || '2h 10m'}</div>
      </div>
    </div>


    <div className="flex items-center gap-6">
      <div className="text-right">
        <div className="text-2xl font-bold text-white">${flight.price.toFixed(2)}</div>
        <div className="text-sm text-slate-300">{flight.seats_available} asientos libres</div>
      </div>
      <button onClick={() => onReserve(flight)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold">Reserva</button>
    </div>
  </div>
  )
}


export default function App() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [message, setMessage] = useState(null)

  
  useEffect(() => {
    loadFlights()
  }, [])

  async function loadFlights() {
    setLoading(true)
    try {
      const res = await axios.get(`${API.FLIGHTS}/flights`).catch(() => ({ data: sampleFlights() }))
      // if API exists expect array
      setFlights(Array.isArray(res.data) ? res.data : sampleFlights())
    } catch (err) {
      console.error(err)
      setFlights(sampleFlights())
    } finally {
    setLoading(false)
    }
  }
 
  function sampleFlights() {
    return [
      { id: 'FL-100', origin: 'BOG', dest: 'MDE', price: 120.0, seats_available: 8, departure: '08:30', duration: '1h 20m' },
      { id: 'FL-101', origin: 'BOG', dest: 'CTG', price: 180.0, seats_available: 5, departure: '10:45', duration: '2h 10m' },
      { id: 'FL-102', origin: 'BOG', dest: 'CLO', price: 95.0, seats_available: 12, departure: '13:10', duration: '1h 05m' },
    ]
  }


function onReserve(flight) {
    setSelected(flight)
    setShowConfirm(true)
}

async function confirmPayment(paymentMethod = 'card') {
  setShowConfirm(false)
  setMessage('Procesando pago...')
  try {
    const bookingRes = await axios.post(`${API.BOOKINGS}/book`, { user_id: 'demo', flight_id: selected.id, amount: selected.price }).catch(() => ({ data: { booking_id: 'B-'+Math.random().toString(36).slice(2,8), status: 'confirmed' } }))
    const booking = bookingRes.data
    
    const payRes = await axios.post(`${API.PAYMENTS}/pay`, { booking_id: booking.booking_id || booking.bookingId || booking.id, amount: selected.price, method: paymentMethod }).catch(() => ({ data: { status: 'paid' } }))
    setMessage('Reservación confirmada!')
    
    loadFlights()
    setTimeout(()=> setMessage(null), 3000)
  } catch (err) {
    console.error(err)
    setMessage('Fallo al completar la reserva')
    setTimeout(()=> setMessage(null), 3000)
  }
}

return (
  <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-6">
    <div className="max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">Rutas de Vuelo</div>
          <div className="text-sm text-slate-300">Reserva de Vuelos</div>
        </div>

        <div className="flex items-center gap-3">
          <IconButton icon={Search} label="Buscar" />
          <IconButton icon={Users} label="Mis reservas" />
          <IconButton icon={Wallet} label="Pagos" />
        </div>
      </header>


      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Vuelos Disponibles</h2>
            <div className="text-sm text-slate-300">Las mejores tarifas para ti</div>
          </div>

          {loading ? (
            <div className="p-6 bg-white/5 rounded-lg">Cargando...</div>
          ) : (
            <div className="space-y-4">
              {flights.map(f => (
                <FlightCard key={f.id} flight={f} onReserve={onReserve} />
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="bg-white/5 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <Calendar size={20} />
              <div>
                <div className="text-sm text-slate-300">Partida</div>
                <div className="font-semibold">Mañana</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <MapPin size={20} />
              <div>
                <div className="text-sm text-slate-300">De</div>
                <div className="font-semibold">BOG</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <CreditCard size={20} />
                <div>
                  <div className="text-sm text-slate-300">Pago</div>
                  <div className="font-semibold">Pagos Seguros</div>
                </div>
              </div>
            </div>
          </aside>
        </main>

        {/* confirm modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-slate-800 p-6 rounded-xl w-[420px]">
              <h3 className="text-lg font-semibold mb-4">Confirmar reserva</h3>
              <div className="mb-4">Vuelo: <strong>{selected.origin} → {selected.dest}</strong></div>
              <div className="mb-4">Precio: <strong>${selected.price.toFixed(2)}</strong></div>
              <div className="flex gap-3 justify-end">
                <button className="px-4 py-2 rounded-lg bg-transparent border border-slate-600" onClick={()=> setShowConfirm(false)}>Cancelar</button>
                <button className="px-4 py-2 rounded-lg bg-emerald-500" onClick={()=> confirmPayment('card')}>Pago con tarjeta</button>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="fixed right-6 bottom-6 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg">{message}</div>
        )}
      </div>
    </div>
  )
}