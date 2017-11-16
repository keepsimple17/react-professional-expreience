/* global fetch */

const { REACT_APP_API_URI } = process.env

const request = endpoint =>
  fetch(`${REACT_APP_API_URI}${endpoint}`)
    .then(res => res.json())
    .then((data) => {
      if (data.status !== 'success') throw new Error(data.message)
      return data
    })

const formatTrip = data => ({
  carbonOutput: data.carbon_generated,
  destinationName: data.to.name,
  distance: data.distance,
  pictureUrl: data.picture_url,
  tripDate: data.to.time_unix
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

const fetchProfile = username => request(`/users/v1/ig/${username}`).then(formatProfile)

const fetchTopProducers = (n = 8) =>
  fetchProfile('asimon9633').then(profile => Array(n).fill(profile))

const fetchProfileFriends = username =>
  fetchProfile(username)
    .then(profile => profile.friends)

const fetchProfileTrips = (username, zipcode) =>
  request(`/trips/v1/ABA/${username}/${zipcode}`)
    .then(data => data.trips)
    .then(trips => trips.map(formatTrip))

export default {
  fetchProfile,
  fetchProfileFriends,
  fetchProfileTrips,
  fetchTopProducers
}
