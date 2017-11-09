const randomInt = (min = 0, max = 1) => {
  const floor = Math.ceil(min)
  const ceil = Math.floor(max)
  return Math.floor(Math.random() * (ceil - floor)) + floor
}

export default randomInt
