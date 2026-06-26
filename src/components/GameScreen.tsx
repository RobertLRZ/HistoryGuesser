import { useState, useEffect } from 'react'
import { events } from '../data/events'
import { fetchCommonsImageUrl } from '../utils/commons'
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'
import ImagePhase from './ImagePhase'
import MapPhase from './MapPhase'
import YearPhase from './YearPhase'
import SummaryScreen from './SummaryScreen'
import PlacementScreen from './PlacementScreen'

const TOTAL_ROUNDS = 3

function pickRandomEvents(count: number) {
    const shuffled = [...events].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
}

export default function GameScreen() {
    const [selectedEvents] = useState(() => pickRandomEvents(TOTAL_ROUNDS))
    const [round, setRound] = useState(0)
    const [phase, setPhase] = useState<'image' | 'map' | 'year' | 'summary' | 'placement'>('image')
    const [placementData, setPlacementData] = useState<{
        name: string
        score: number
        rank: number
        above: { name: string; score: number } | null
        below: { name: string; score: number } | null
    } | null>(null)
    const [guess, setGuess] = useState<{ lat: number; lng: number } | null>(null)
    const [mapScore, setMapScore] = useState(0)
    const [yearScore, setYearScore] = useState(0)
    const [totalScore, setTotalScore] = useState(0)
    const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

    useEffect(() => {
        selectedEvents.forEach(ev => {
            fetchCommonsImageUrl(ev.wikimedia_file, ev.image).then(url => {
                setImageUrls(prev => ({ ...prev, [ev.wikimedia_file]: url }))
            })
        })
    }, [])

    const event = selectedEvents[round]
    const isLastRound = round === TOTAL_ROUNDS - 1
    const imageUrl = imageUrls[event.wikimedia_file] ?? event.image

    function goToNextRound() {
        setGuess(null)
        setMapScore(0)
        setYearScore(0)
        setRound(r => r + 1)
        setPhase('image')
    }

    if (phase === 'placement' && placementData) return (
        <PlacementScreen {...placementData} />
    )

    if (phase === 'image') return (
        <ImagePhase event={event} imageUrl={imageUrl} round={round} totalRounds={TOTAL_ROUNDS} onNext={() => setPhase('map')} />
    )
    if (phase === 'map') return (
        <MapPhase
            event={event}
            imageUrl={imageUrl}
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
        imageUrl={imageUrl}
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
        imageUrl={imageUrl}
        round={round}
        totalRounds={TOTAL_ROUNDS}
        mapScore={mapScore}
        yearScore={yearScore}
        totalScore={totalScore}
        isLastRound={isLastRound}
        onNext={isLastRound ? () => window.location.reload() : goToNextRound}
        onFinish={async (name: string) => {
            const docRef = await addDoc(collection(db, 'scores'), {
                name,
                score: totalScore,
                date: Timestamp.now(),
            })
            const snapshot = await getDocs(query(collection(db, 'scores'), orderBy('score', 'desc')))
            const docs = snapshot.docs
            const rank = docs.findIndex(d => d.id === docRef.id)
            setPlacementData({
                name,
                score: totalScore,
                rank: rank + 1,
                above: rank > 0 ? { name: docs[rank - 1].data().name, score: docs[rank - 1].data().score } : null,
                below: rank < docs.length - 1 ? { name: docs[rank + 1].data().name, score: docs[rank + 1].data().score } : null,
            })
            setPhase('placement')
        }}
    />
)
}