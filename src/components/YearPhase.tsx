import { useState } from 'react'
import type { Event } from '../types/Event'
import { calculateYearScore } from '../utils/scoring'
import RoundBadge from './RoundBadge'

type Props = {
    event: Event
    round: number
    totalRounds: number
    onNext: (score: number) => void
}

export default function YearPhase({ event, round, totalRounds, onNext }: Props) {
    const [yearGuess, setYearGuess] = useState(1000)
    const [revealed, setRevealed] = useState(false)
    const score = calculateYearScore(yearGuess, event.year)

    return (
        <div className="min-h-screen bg-[#C8B88A] p-6 flex flex-col items-center gap-6">
            <h1 className="text-2xl font-black text-black">HistoryGuesser</h1>
            <RoundBadge round={round} totalRounds={totalRounds} />
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
                disabled={revealed}
            />

            {!revealed ? (
                <button
                    onClick={() => setRevealed(true)}
                    className="bg-[#4B9345] hover:bg-[#4A7A4A] text-white font-bold text-3xl px-12 py-3 rounded-2xl"
                >
                    Bestätigen
                </button>
            ) : (
                <div className="flex flex-col items-center gap-4 w-full max-w-lg">
                    <div className="bg-white rounded-2xl px-10 py-6 text-center w-full" style={{ border: '2px solid #a89060' }}>
                        <p className="text-2xl font-black text-black">Richtiges Jahr:</p>
                        <p className="text-4xl font-black text-black mb-4">{event.year}</p>
                        <p className="text-2xl font-black text-black">Abweichung:</p>
                        <p className="text-4xl font-black text-black mb-4">{Math.abs(yearGuess - event.year)} Jahre</p>
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
                    <button
                        onClick={() => onNext(score)}
                        className="bg-[#4B9345] hover:bg-[#4A7A4A] text-white font-bold text-3xl px-12 py-3 rounded-2xl"
                    >
                        Weiter
                    </button>
                </div>
            )}
        </div>
    )
}