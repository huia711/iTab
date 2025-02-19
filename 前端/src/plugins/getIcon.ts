export function getFavicon(url: string) {
    const urlObj = new URL(url)
    return `${urlObj.origin}/favicon.ico`
}