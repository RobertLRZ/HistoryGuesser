import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMapEvents, Marker, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import type { Event } from '../types/Event'
import { calculateDistance, calculateScore } from '../utils/scoring'
import RoundBadge from './RoundBadge'

L.Marker.prototype.options.icon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconAnchor: [12, 41],
})

const solutionIcon = L.divIcon({
    className: '',
    html: '<div style="background:green;width:24px;height:24px;border-radius:50%;border:2px solid white;"></div>',
    iconAnchor: [12, 12],
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

type Props = {
    event: Event
    imageUrl: string
    guess: { lat: number; lng: number } | null
    round: number
    totalRounds: number
    setGuess: (guess: { lat: number; lng: number }) => void
    onNext: (score: number) => void
}

export default function MapPhase({ event, imageUrl, guess, round, totalRounds, setGuess, onNext }: Props) {
    const [revealed, setRevealed] = useState(false)

    return (
        <div className="relative w-full h-screen">
            <RoundBadge round={round} totalRounds={totalRounds} />
            <MapContainer
                center={[20, 0]}
                zoom={2}
                zoomControl={false}
                style={{ width: '100%', height: '100vh' }}
                minZoom={2}
                maxBounds={[[-85, -Infinity], [85, Infinity]]}
                worldCopyJump={true}
            >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                <MapClickHandler onMapClick={(lat, lng) => {
                    if (!revealed) setGuess({ lat, lng })
                }} />
                {guess && <Marker position={[guess.lat, guess.lng]} />}
                {revealed && <Marker position={[event.lat, event.lng]} icon={solutionIcon} />}
                {revealed && guess && (
                    <Polyline
                        positions={[[guess.lat, guess.lng], [event.lat, event.lng]]}
                        pathOptions={{ color: 'black', dashArray: '8 8', weight: 2 }}
                    />
                )}
                {revealed && guess && (
                    <FitBounds guess={guess} solution={{ lat: event.lat, lng: event.lng }} />
                )}
            </MapContainer>

            {revealed && guess && (() => {
                const distance = calculateDistance(guess.lat, guess.lng, event.lat, event.lng)
                const score = calculateScore(distance)
                return (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] rounded-2xl px-10 py-6 text-center w-80 bg-white" style={{ border: '2px solid #a89060' }}>
                        <p className="text-2xl font-black" style={{ color: 'black' }}>Distanz:</p>
                        <p className="text-2xl font-black mb-4" style={{ color: 'black' }}>{Math.round(distance)} km</p>
                        <div className="relative h-5 rounded-full mb-4" style={{ background: 'linear-gradient(to right, #ef4444, #eab308, #22c55e)' }}>
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-800"
                                style={{ left: `clamp(0px, calc(${score * 2}% - 8px), calc(100% - 16px))` }}
                            />
                        </div>
                        <p className="text-2xl font-black" style={{ color: `hsl(${score * 2}, 80%, 40%)` }}>
                            {score}/50 Punkte
                        </p>
                    </div>
                )
            })()}

            {!revealed && (
                <img
                    src={imageUrl}
                    alt={event.title}
                    className="absolute top-4 left-4 z-[1000] w-48 rounded-xl object-cover cursor-pointer"
                />
            )}
            {guess && (
                <button
                    onClick={() => {
                        if (revealed) {
                            const distance = calculateDistance(guess.lat, guess.lng, event.lat, event.lng)
                            const score = calculateScore(distance)
                            onNext(score)
                        } else {
                            setRevealed(true)
                        }
                    }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-[#4B9345] hover:bg-[#4A7A4A] text-white font-bold text-3xl px-12 py-3 rounded-2xl"
                >
                    {revealed ? 'Weiter' : 'Bestätigen'}
                </button>
            )}
        </div>
    )
}