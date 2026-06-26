import type { Event } from '../types/Event'
import RoundBadge from './RoundBadge'

type Props = {
    event: Event
    imageUrl: string
    round: number
    totalRounds: number
    onNext: () => void
}

export default function ImagePhase({ event, imageUrl, round, totalRounds, onNext }: Props) {
    return (
        <div className="min-h-screen bg-[#C8B88A] p-6">
            <h1 className="text-2xl font-black text-black w-full">HistoryGuesser</h1>
            <RoundBadge round={round} totalRounds={totalRounds} />
            <div className="flex flex-col items-center gap-6">
                <h2 className="text-2xl font-black text-black mt-8">Wann und Wo passierte das?</h2>
                <img src={imageUrl} alt={event.title} className="w-full max-w-2xl rounded-2xl object-contain" />
                <button
                    onClick={onNext}
                    className="bg-[#4B9345] hover:bg-[#4A7A4A] text-white font-bold text-3xl px-12 py-3 rounded-2xl"
                >
                    Raten
                </button>
            </div>
        </div>
    )
}