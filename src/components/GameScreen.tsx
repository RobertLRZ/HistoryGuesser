import { useState } from 'react'
import { events } from '../data/events'
import { useNavigate } from 'react-router-dom'
import ImagePhase from './ImagePhase'
import MapPhase from './MapPhase'
import YearPhase from './YearPhase'
import SummaryScreen from './SummaryScreen'

const TOTAL_ROUNDS = 3

function pickRandomEvents(count: number) {
    const shuffled = [...events].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
}

export default function GameScreen() {
    const navigate = useNavigate() 
    const [selectedEvents] = useState(() => pickRandomEvents(TOTAL_ROUNDS))
    const [round, setRound] = useState(0)
    const [phase, setPhase] = useState<'image' | 'map' | 'year' | 'summary'>('image')
    const [guess, setGuess] = useState<{ lat: number; lng: number } | null>(null)
    const [mapScore, setMapScore] = useState(0)
    const [yearScore, setYearScore] = useState(0)
    const [totalScore, setTotalScore] = useState(0)

    const event = selectedEvents[round]
    const isLastRound = round === TOTAL_ROUNDS - 1

    function goToNextRound() {
        setGuess(null)
        setMapScore(0)
        setYearScore(0)
        setRound(r => r + 1)
        setPhase('image')
    }

    if (phase === 'image') return (
        <ImagePhase event={event} round={round} totalRounds={TOTAL_ROUNDS} onNext={() => setPhase('map')} />
    )
    if (phase === 'map') return (
        <MapPhase
            event={event}
            round={round}
            totalRounds={TOTAL_ROUNDS}
            guess={guess}
            setGuess={setGuess}
            onNext={(score: number) => {
                setMapScore(score)
                setPhase('year')
            }}
        />
    )
   if (phase === 'year') return (
    <YearPhase
        event={event}
        round={round}
        totalRounds={TOTAL_ROUNDS}
        onNext={(score: number) => {
            setYearScore(score)
            setTotalScore(t => t + mapScore + score)
            setPhase('summary')
        }}
    />
)
return (
    <SummaryScreen
        event={event}
        round={round}
        totalRounds={TOTAL_ROUNDS}
        mapScore={mapScore}
        yearScore={yearScore}
        totalScore={totalScore}
        isLastRound={isLastRound}
        onNext={isLastRound ? () => window.location.reload() : goToNextRound}
        onFinish={() => navigate('/')}
    />
)
}