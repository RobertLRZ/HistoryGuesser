export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function calculateScore(distanceKm: number): number {
    if (distanceKm < 2000) {
        return Math.max(8, Math.round(50 * Math.exp(-0.0015 * distanceKm)))
    }
    return Math.max(0, Math.round(8 * Math.exp(-0.0003 * (distanceKm - 2000))))
}

export function calculateYearScore(guessed: number, actual: number): number {
    const diff = Math.abs(guessed - actual)
    if (diff === 0) return 50
    return Math.max(0, Math.round(50 * Math.exp(-0.03 * diff)))
}