export function getNumberOfPlayersFromTheLocalStorage(): number {
    const data = Number(localStorage.getItem('players')) || 0
    return data 
}

export function setNumberOfPlayersFromTheLocalStorage (key: string, value: number) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function getEliminationFromTheLocalStorage () {
    const data = Boolean(localStorage.getItem('elimination')) 
    return data
}

export function setEliminationFromTheLocalStorage (key: string, value: boolean) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function getDifficultyLevelFromTheLocalStorage () {
    const data = Number(localStorage.getItem('difficulty_level'))
    return data
}

export function setDifficultyLevelFromTheLocalStorage (key: string, value: number) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function getTimeToDoFromTheLocalStorage () {
    const data = Number(localStorage.getItem('time_to_do'))
    return data
}

export function setTimeToDoFromTheLocalStorage (key: string, value: number) {
    localStorage.setItem(key, JSON.stringify(value))
}

