/* global fetch */

import randomInt from './util/randomInt'

const { REACT_APP_API_URI } = process.env

const getRandomLetter = () => String.fromCharCode(randomInt(65, 91))

const getRandomTrip = () => ({
  carbonOutput: randomInt(30, 5000),
  date: '25 Jun 14',
  destination: 'Honolulu, HI',
  distance: randomInt(30, 5000),
  pictureUrl: `https://source.unsplash.com/random/420x420?${getRandomLetter()}`
})

const formatProfile = profile => ({
  carbonOutput: randomInt(1000, 10000),
  fullName: `${profile.name.first || ''} ${profile.name.last || ''}`.trim(),
  profilePictureUrl: profile.picture.large,
  trips: Array.from({ length: randomInt(1, 50) }, getRandomTrip),
  username: profile.login.username
})

const fetchTopProducers = (n = 8) =>
  fetch(`${REACT_APP_API_URI}?results=${n}`)
    .then(res => res.json())
    .then(data => data.results)
    .then(profiles => profiles.map(formatProfile))

const fetchProfile = username => fetchTopProducers(1).then(profiles => profiles[0])

const fetchProfileFriends = username => fetchTopProducers()

export default {
  fetchProfile,
  fetchProfileFriends,
  fetchTopProducers
}
