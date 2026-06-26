import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Entry = { name: string; score: number }

type Props = {
    name: string
    score: number
    rank: number
    above: Entry | null
    below: Entry | null
}

const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function PlacementScreen({ name, score, rank, above, below }: Props) {
    const navigate = useNavigate()
    const [displayRank, setDisplayRank] = useState(Math.min(rank + 12, 99))
    const [showRows, setShowRows] = useState(false)
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        const steps = Math.min(rank + 12, 99) - rank
        const duration = 900
        const interval = duration / steps
        let current = Math.min(rank + 12, 99)

        const timer = setInterval(() => {
            current -= 1
            setDisplayRank(current)
            if (current <= rank) {
                clearInterval(timer)
                setTimeout(() => setShowRows(true), 200)
                setTimeout(() => setShowButton(true), 900)
            }
        }, interval)

        return () => clearInterval(timer)
    }, [rank])

    const medal = medals[rank]

    return (
        <>
            <style>{`
                @keyframes dropIn {
                    from { opacity: 0; transform: translateY(-40px) scale(0.8); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes rankPop {
                    0%   { transform: scale(0.5); opacity: 0; }
                    70%  { transform: scale(1.15); opacity: 1; }
                    100% { transform: scale(1); }
                }
                @keyframes slideLeft {
                    from { opacity: 0; transform: translateX(-60px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideRight {
                    from { opacity: 0; transform: translateX(60px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes popIn {
                    0%   { opacity: 0; transform: scale(0.7); }
                    65%  { transform: scale(1.05); }
                    100% { opacity: 1; transform: scale(1); }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .shimmer-row {
                    background: linear-gradient(90deg, #4B9345 30%, #6abf63 50%, #4B9345 70%);
                    background-size: 200% auto;
                    animation: shimmer 2s linear infinite;
                }
            `}</style>

            <div className="min-h-screen bg-[#C8B88A] flex flex-col items-center justify-center gap-6 px-4">
                <h1
                    className="text-4xl font-black text-black"
                    style={{ animation: 'dropIn 0.5s ease both' }}
                >
                    HistoryGuesser
                </h1>

                <div
                    className="flex flex-col items-center gap-1"
                    style={{ animation: 'dropIn 0.5s ease 0.1s both' }}
                >
                    <p className="text-xl font-bold text-black">Deine Platzierung</p>
                    <div
                        className="text-8xl font-black text-black leading-none"
                        style={{ animation: 'rankPop 0.4s ease 0.2s both' }}
                    >
                        {medal ?? `#${displayRank}`}
                    </div>
                    {medal && (
                        <div
                            className="text-5xl font-black text-black"
                            style={{ animation: 'rankPop 0.4s ease 0.35s both' }}
                        >
                            Platz {displayRank}
                        </div>
                    )}
                </div>

                <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ border: '2px solid #a89060' }}>
                    {above && showRows && (
                        <div
                            className="flex items-center justify-between px-6 py-3 bg-white"
                            style={{ borderBottom: '1px solid #a89060', animation: 'slideLeft 0.4s ease both' }}
                        >
                            <span className="text-lg font-black text-black w-8">{rank - 1}.</span>
                            <span className="text-lg font-bold text-black flex-1 ml-2">{above.name}</span>
                            <span className="text-lg font-black text-black">{above.score}</span>
                        </div>
                    )}

                    {showRows && (
                        <div
                            className="shimmer-row flex items-center justify-between px-6 py-5"
                            style={{
                                borderBottom: below ? '1px solid #a89060' : undefined,
                                animation: 'popIn 0.5s ease 0.15s both',
                            }}
                        >
                            <span className="text-2xl font-black text-white w-8">{rank}.</span>
                            <span className="text-2xl font-black text-white flex-1 ml-2">{name}</span>
                            <span className="text-2xl font-black text-white">{score}</span>
                        </div>
                    )}

                    {below && showRows && (
                        <div
                            className="flex items-center justify-between px-6 py-3 bg-white"
                            style={{ animation: 'slideRight 0.4s ease 0.3s both' }}
                        >
                            <span className="text-lg font-black text-black w-8">{rank + 1}.</span>
                            <span className="text-lg font-bold text-black flex-1 ml-2">{below.name}</span>
                            <span className="text-lg font-black text-black">{below.score}</span>
                        </div>
                    )}
                </div>

                {showButton && (
                    <button
                        onClick={() => navigate('/')}
                        className="bg-[#4B9345] hover:bg-[#4A7A4A] text-white font-bold text-3xl px-12 py-3 rounded-2xl"
                        style={{ animation: 'fadeUp 0.4s ease both' }}
                    >
                        Zur Startseite
                    </button>
                )}
            </div>
        </>
    )
}
