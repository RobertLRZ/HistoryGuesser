import { useState, useEffect } from 'react'
import { events } from '../data/events'
import { MapContainer, TileLayer, useMapEvents, Marker, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'



L.Marker.prototype.options.icon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconAnchor: [12, 41],
})

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            const lat = e.latlng.lat
            let lng = e.latlng.lng
            lng = ((lng + 180) % 360 + 360) % 360 - 180
            onMapClick(lat, lng)
        }
    })
    return null
}
function FitBounds({ guess, solution }: { guess: { lat: number; lng: number }, solution: { lat: number; lng: number } }) {
    const map = useMap()
    useEffect(() => {
        map.flyToBounds(
            [[guess.lat, guess.lng], [solution.lat, solution.lng]],
            { padding: [100, 100], duration: 1.5 }
        )
    }, [])
    return null
}
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Erdradius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
function calculateScore(distanceKm: number): number {
    if (distanceKm < 2000) {
        return Math.max(8, Math.round(50 * Math.exp(-0.0015 * distanceKm)))
    }
    return Math.max(0, Math.round(8 * Math.exp(-0.0003 * (distanceKm - 2000))))
}

const solutionIcon = L.divIcon({
    className: '',
    html: '<div style="background:green;width:24px;height:24px;border-radius:50%;border:2px solid white;"></div>',
    iconAnchor: [12, 12],
})

export default function GameScreen() {
    const [guess, setGuess] = useState<{ lat: number; lng: number } | null>(null)
    const [currentIndex] = useState(() => Math.floor(Math.random() * events.length))
    const [revealed, setRevealed] = useState(false)
    const [phase, setPhase] = useState<'image' | 'map' | 'year'>('image')
    const event = events[currentIndex]
    const [yearGuess, setYearGuess] = useState(1000)
    if (phase === 'year') return (
        <div className="min-h-screen bg-[#C8B88A] p-6 flex flex-col items-center gap-6">
            <h1 className="text-2xl font-black text-black">HistoryGuesser</h1>

            <img src={event.image} alt={event.title} className="w-full max-w-sm rounded-2xl object-contain" />

            <h2 className="text-2xl font-black text-black">In welchem Jahr passierte das?</h2>

            <p className="text-6xl font-black text-black">{yearGuess}</p>

            <input
                type="range"
                min={-500}
                max={2024}
                value={yearGuess}
                onChange={(e) => setYearGuess(Number(e.target.value))}
                className="w-full max-w-lg"
            />

            <button
                onClick={() => alert(`Richtig: ${event.year}`)}
                className="bg-[#4B9345] hover:bg-[#4A7A4A] text-white font-bold text-3xl px-12 py-3 rounded-2xl"
            >
                Bestätigen
            </button>
        </div>
    )
    if (phase === 'map') return (
        <div className="relative w-full h-screen">
            <MapContainer center={[20, 0]} zoom={2} zoomControl={false} style={{ width: '100%', height: '100vh' }} minZoom={2} maxBounds={[[-85, -Infinity], [85, Infinity]]} worldCopyJump={true}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                <MapClickHandler onMapClick={(lat, lng) => {
                    if (!revealed) setGuess({ lat, lng })
                }} />
                {guess && <Marker position={[guess.lat, guess.lng]} />}
                {revealed && (
                    <Marker position={[event.lat, event.lng]} icon={solutionIcon} />
                )}
                {revealed && guess && (
                    <Polyline
                        positions={[[guess.lat, guess.lng], [event.lat, event.lng]]}
                        pathOptions={{ color: 'black', dashArray: '8 8', weight: 2 }}
                    />
                )}
                {revealed && guess && (
                    <FitBounds guess={guess} solution={{ lat: event.lat, lng: event.lng }} />
                )}
                {revealed && guess && (() => {
                    const distance = calculateDistance(guess.lat, guess.lng, event.lat, event.lng)
                    const score = calculateScore(distance)
                    return (
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] rounded-2xl px-10 py-6 text-center w-80 bg-white" style={{ border: '2px solid #a89060' }}>

                            <p className="text-2xl font-black" style={{ color: 'black' }}>Distanz:</p>
                            <p className="text-4xl font-black mb-4" style={{ color: 'black' }}>{Math.round(distance)} km</p>

                            <div className="relative h-5 rounded-full mb-4" style={{ background: 'linear-gradient(to right, #ef4444, #eab308, #22c55e)' }}>
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-800"
                                    style={{ left: `clamp(0px, calc(${score * 2}% - 8px), calc(100% - 16px))` }}
                                />
                            </div>

                            <p className="text-4xl font-black" style={{ color: `hsl(${score * 2}, 80%, 40%)` }}>
                                {score}/50 Punkte
                            </p>

                        </div>
                    )
                })()}
            </MapContainer>

            <img
                src={event.image}
                alt={event.title}
                className="absolute top-4 left-4 z-[1000] w-48 rounded-xl object-cover cursor-pointer"
            />
            {guess && (
                <button
                    onClick={revealed ? () => setPhase('year') : () => setRevealed(true)}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-[#4B9345] hover:bg-[#4A7A4A] text-white font-bold text-3xl px-12 py-3 rounded-2xl"
                >
                    {revealed ? 'Weiter' : 'Bestätigen'}
                </button>
            )}
        </div>
    )

    return (
        <div className="min-h-screen bg-[#C8B88A] p-6">
            <h1 className="text-2xl font-black text-black mb-6">HistoryGuesser</h1>
            <div className="flex flex-col items-center gap-6">
                <h2 className="text-2xl font-black text-black">Wann und Wo passierte das?</h2>
                <img src={event.image} alt={event.title} className="w-full max-w-2xl rounded-2xl object-contain" />
                <button
                    onClick={() => setPhase('map')}
                    className="bg-[#4B9345] hover:bg-[#4A7A4A] text-white font-bold text-3xl px-12 py-3 rounded-2xl"
                >
                    Raten
                </button>
            </div>
        </div>
    )
}