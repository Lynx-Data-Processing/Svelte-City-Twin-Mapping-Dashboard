export const getUTCTime = (time: string) => {
    return Math.floor(new Date(time).getTime() / 1000)
}