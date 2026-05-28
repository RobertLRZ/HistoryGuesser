type Props = {
    round: number
    totalRounds: number
}

export default function RoundBadge({ round, totalRounds }: Props) {
    return (
        <div className="absolute top-4 right-4 z-[1000] bg-white rounded-xl px-4 py-2" style={{ border: '2px solid #a89060' }}>
            <span className="text-lg font-black text-black">{round + 1} / {totalRounds}</span>
        </div>
    )
}