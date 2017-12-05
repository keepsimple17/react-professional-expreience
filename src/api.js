/* global fetch */

const { REACT_APP_API_URI } = process.env

const serialize = obj => Object
  .keys(obj)
  .filter(k => obj[k])
  .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
  .join('&')

const request = (endpoint, params = {}) =>
  fetch(`${REACT_APP_API_URI}${endpoint}?${serialize(params)}`)
    .then(res => res.json())
    .then((data) => {
      if (data.status !== 'success') throw new Error(data.message)
      return data
    })

const formatTrip = data => ({
  carbonOutput: data.carbon_generated,
  destinationName: data.to.name,
  distance: data.distance,
  id: data.picture_url,
  pictureUrl: data.picture_url,
  tripDate: data.to.time_unix
})

const formatProfile = profile => ({
  carbonOutput: profile.estimated_carbon,
  fullName: profile.instagram_name,
  friends: {
    friends: profile.friends ? profile.friends.map(formatProfile) : [],
    completed: profile.friends_complete
  },
  instagramId: profile.instagram_id,
  profilePictureUrl: profile.picture_url,
  private: profile.private,
  username: profile.instagram_username,
  zipcode: profile.address_zip
})

const fetchProfile = username =>
  request(`/users/v1/ig/${username}`).then(data => formatProfile(data.user))

const fetchTopProducers = () =>
  request('/feeds/v1/top-offenders').then(data => data.entities.map(formatProfile))

const fetchProfileFriends = username =>
  fetchProfile(username).then(profile => profile.friends)

const fetchProfileTrips = (username, zipcode, limit) =>
  request(`/trips/v1/ABA/${username}/${zipcode}`, { limit }).then(data => ({
    completed: data.feed_trips,
    trips: data.trips.map(formatTrip)
  }))

export default {
  fetchProfile,
  fetchProfileFriends,
  fetchProfileTrips,
  fetchTopProducers
}
