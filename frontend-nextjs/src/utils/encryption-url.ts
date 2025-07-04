export const encodeUrl = (url: string) => {
    const base4 = btoa(url)
    return encodeURIComponent(base4)
}
export const decodeUrl=(url: string) => {
    const base64 = decodeURIComponent(url)
    return atob(base64)
}