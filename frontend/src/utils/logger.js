const info = (...params) => {
    if (import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test') {
        console.log(...params)
    }
}

const error = (...params) => {
    console.error(...params)
}

export default { info, error }
