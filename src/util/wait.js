const wait = (ms, x) => new Promise(resolve => setTimeout(() => resolve(x), ms))

export default wait
