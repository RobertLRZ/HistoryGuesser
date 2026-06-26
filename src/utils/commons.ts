const cache = new Map<string, string>()

export async function fetchCommonsImageUrl(filename: string, fallback: string): Promise<string> {
    if (cache.has(filename)) return cache.get(filename)!

    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent('File:' + filename)}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`

    try {
        const res = await fetch(apiUrl)
        const data = await res.json()
        const pages = data?.query?.pages
        const page = pages ? Object.values(pages)[0] as any : null
        const resolvedUrl = page?.imageinfo?.[0]?.thumburl ?? page?.imageinfo?.[0]?.url ?? fallback
        cache.set(filename, resolvedUrl)
        return resolvedUrl
    } catch {
        return fallback
    }
}
