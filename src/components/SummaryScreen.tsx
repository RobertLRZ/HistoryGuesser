import { useState } from 'react'
import type { Event } from '../types/Event'
import RoundBadge from './RoundBadge'

type Props = {
    event: Event
    imageUrl: string
    round: number
    totalRounds: number
    mapScore: number
    yearScore: number
    totalScore: number
    isLastRound: boolean
    onNext: () => void
    onFinish: (name: string) => void
}

export default function SummaryScreen({ event, imageUrl, mapScore, yearScore, totalScore, isLastRound, round, totalRounds, onNext, onFinish }: Props) {
    const [name, setName] = useState('')
    const [enteringName, setEnteringName] = useState(false)
    const total = mapScore + yearScore

    if (enteringName) return (
        <div className="min-h-screen bg-[#C8B88A] p-6 flex flex-col items-center justify-center gap-6">
            <h1 className="text-2xl font-black text-black">HistoryGuesser</h1>
            <div className="bg-white rounded-2xl px-10 py-8 w-full max-w-lg flex flex-col items-center gap-6" style={{ border: '2px solid #a89060' }}>
                <p className="text-3xl font-black text-black text-center">Name:</p>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
            
                    className="w-full text-center text-2xl font-black text-black bg-gray-50 rounded-2xl px-6 py-4 border-2 border-[#a89060] outline-none transition-all duration-300 focus:border-[#4B9345] focus:scale-105 focus:shadow-lg placeholder:text-gray-300"
                />
                <button
                    onClick={() => name.trim() !== '' && onFinish(name)}
                    disabled={name.trim() === ''}
                    className={`text-white font-bold text-2xl px-12 py-3 rounded-2xl transition-all duration-200 ${name.trim() !== '' ? 'bg-[#4B9345] hover:bg-[#4A7A4A]' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                    Eintragen
                </button>
            </div>
        </div>
    )

    return (
        <div className="relative min-h-screen bg-[#C8B88A] p-6 flex flex-col items-center gap-6">
            <h1 className="text-2xl font-black text-black w-full">HistoryGuesser</h1>
            <RoundBadge round={round} totalRounds={totalRounds} />
            <img src={imageUrl} alt={event.title} className="w-full max-w-sm rounded-2xl object-contain" />
            <h2 className="text-3xl font-black text-black text-center">{event.title}</h2>
            <p className="text-base text-black text-center max-w-lg">{event.description}</p>

            <div className="bg-white rounded-2xl px-10 py-6 w-full max-w-lg" style={{ border: '2px solid #a89060' }}>
                <div className="flex justify-between mb-2">
                    <span className="text-xl font-bold text-black">Ort</span>
                    <span className="text-xl font-bold text-black">{mapScore}/50</span>
                </div>
                <div className="flex justify-between mb-4">
                    <span className="text-xl font-bold text-black">Jahr</span>
                    <span className="text-xl font-bold text-black">{yearScore}/50</span>
                </div>
                <div className="border-t-2 border-[#a89060] pt-4 flex justify-between">
                    <span className="text-2xl font-black text-black">Diese Runde</span>
                    <span className="text-2xl font-black" style={{ color: `hsl(${total * 1.8}, 80%, 40%)` }}>
                        {total}/100
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-2xl px-10 py-4 w-full max-w-lg text-center" style={{ border: '2px solid #a89060' }}>
                <p className="text-xl font-bold text-black">Gesamtpunkte</p>
                <p className="text-2xl font-black" style={{ color: `hsl(${(totalScore / ((round + 1) * 100)) * 120}, 80%, 40%)` }}>
                    {totalScore} / {(round + 1) * 100}
                </p>
            </div>

            <button
                onClick={isLastRound ? () => setEnteringName(true) : onNext}
                className="bg-[#4B9345] hover:bg-[#4A7A4A] text-white font-bold text-3xl px-12 py-3 rounded-2xl"
            >
                {isLastRound ? 'In BME Rangliste eintragen' : 'Nächstes Event'}
            </button>
        </div>
    )
}