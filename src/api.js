/* global fetch */

const { REACT_APP_API_URI } = process.env

const getRandomInt = (min = 0, max = 1) => {
  const floor = Math.ceil(min)
  const ceil = Math.floor(max)
  return Math.floor(Math.random() * (ceil - floor)) + floor
}

const getRandomTrip = () => ({
  carbonOutput: getRandomInt(100, 1000),
  pictureUrl: `https://source.unsplash.com/random/420x420?${String.fromCharCode(getRandomInt(65, 91))}`
})

const formatProfile = profile => ({
  carbonOutput: getRandomInt(1000, 10000),
  fullName: `${profile.name.first || ''} ${profile.name.last || ''}`.trim(),
  profilePictureUrl: profile.picture.large,
  trips: Array.from({ length: getRandomInt(3, 6) }, getRandomTrip),
  username: profile.login.username
})

const fetchTopProducers = (n = 8) =>
  fetch(`${REACT_APP_API_URI}?results=${n}`)
    .then(res => res.json())
    .then(data => data.results)
    .then(profiles => profiles.map(formatProfile))

export default {
  fetchTopProducers
}
