// @ts-ignore
export const getUTCTime = (time) =>{
    return Math.floor(new Date(time).getTime() / 1000)
}