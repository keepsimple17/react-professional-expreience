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
  carbonOutput: profile.estimated_carbon,
  fullName: profile.instagram_name,
  friends: profile.friends,
  instagramId: profile.instagramId,
  profilePictureUrl: profile.picture_url,
  username: profile.instagram_username,
  zipcode: profile.address_zip
})

const fetchProfile = username => request(`/users/v1/ig/${username}`).then(data => formatProfile(data.user))

const fetchTopProducers = (n = 8) =>
  fetchProfile('asimon9633').then(profile => Array(n).fill(profile))

const fetchProfileFriends = username =>
  fetchProfile(username)
    .then(profile => profile.friends.map(formatProfile))

const fetchProfileTrips = (username, zipcode) =>
  request(`/trips/v1/ABA/${username}/${zipcode}`)
    .then(data => ({
      ...data,
      trips: data.trips.map(formatTrip)
    }))

export default {
  fetchProfile,
  fetchProfileFriends,
  fetchProfileTrips,
  fetchTopProducers
}
