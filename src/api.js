/* global fetch */

const { REACT_APP_API_URI } = process.env

const formatTrip = data => ({
  carbonOutput: data.carbon,
  destinationName: data.location_name,
  distance: data.distance,
  pictureUrl: data.picture_url,
  tripDate: data.time
})

const formatProfile = profile => ({
  carbonOutput: profile.user.estimated_carbon,
  fullName: profile.user.instagram_name,
  instagramId: profile.user.instagramId,
  profilePictureUrl: profile.user.picture_url,
  signedUp: profile.is_signup,
  username: profile.user.instagram_username,
  zipcode: profile.user.address_zip
})

const fetchProfile = username =>
  fetch(`${REACT_APP_API_URI}/users/v1/ig/${username}`)
    .then(res => res.json())
    .then(formatProfile)

const fetchTopProducers = (n = 8) =>
  fetchProfile('asimon9633')
    .then(profile => Array(n).fill(profile))

const fetchProfileFriends = username => fetchTopProducers()

const fetchProfileTrips = (username, zipcode = '33114') =>
  fetch(`${REACT_APP_API_URI}/trips/v1/ABA/${username}/${zipcode}`)
    .then(res => res.json())
    .then(data => data.trips)
    .then(trips => trips.map(formatTrip))

export default {
  fetchProfile,
  fetchProfileFriends,
  fetchProfileTrips,
  fetchTopProducers
}
