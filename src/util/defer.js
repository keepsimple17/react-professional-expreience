const defer = () => {
  const bag = {}
  return Object.assign(
    new Promise((resolve, reject) => Object.assign(bag, { resolve, reject })),
    bag
  )
}

export default defer
