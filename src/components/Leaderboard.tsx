import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase'

type Entry = {
    id: string
    name: string
    score: number
}

export default function Leaderboard() {
    const [entries, setEntries] = useState<Entry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getDocs(query(collection(db, 'scores'), orderBy('score', 'desc'), limit(15)))
            .then(snapshot => {
                setEntries(snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    score: doc.data().score,
                })))
            })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="w-full max-w-lg">
            <h2 className="text-2xl font-black text-black text-center mb-4">Rangliste</h2>
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '2px solid #a89060' }}>
                {loading ? (
                    <p className="text-center text-black font-bold py-6">Lädt...</p>
                ) : entries.length === 0 ? (
                    <p className="text-center text-black font-bold py-6">Noch keine Einträge</p>
                ) : (
                    entries.map((entry, i) => (
                        <div
                            key={entry.id}
                            className="flex items-center justify-between px-6 py-3"
                            style={{ borderBottom: i < entries.length - 1 ? '1px solid #a89060' : undefined }}
                        >
                            <span className="text-lg font-black text-black w-8">{i + 1}.</span>
                            <span className="text-lg font-bold text-black flex-1 ml-2">{entry.name}</span>
                            <span className="text-lg font-black" style={{ color: `hsl(${(entry.score / 300) * 120}, 80%, 40%)` }}>
                                {entry.score}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
