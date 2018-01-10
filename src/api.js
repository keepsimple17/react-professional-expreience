/* global fetch */

import pipe from './util/pipe'

const { REACT_APP_API_URI } = process.env

const serialize = obj =>
  Object.keys(obj)
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

const normalizeProfile = (profile) => {
  const { user, ...rest } = profile
  return {
    ...rest,
    ...user
  }
}

const formatProfile = profile => ({
  carbonOutput: profile.estimated_carbon,
  fullName: profile.instagram_name,
  friends: {
    friends: profile.friends ? profile.friends.map(formatProfile) : [],
    completed: profile.friends ? profile.friends_complete : false
  },
  instagramId: profile.instagram_id,
  private: profile.private,
  profilePictureUrl: profile.picture_url,
  scraped: 'is_feed' in profile ? !!profile.is_feed : true,
  trips: {
    trips: profile.trips ? profile.trips.map(formatTrip) : [],
    completed: 'trips' in profile
  },
  username: profile.instagram_username,
  zipcode: profile.address_zip
})

const fetchProfile = username =>
  request(`/users/v1/ig/${username}`).then(pipe([normalizeProfile, formatProfile]))

const fetchTopProducers = () =>
  request('/feeds/v1/top-offenders').then(data => data.entities.map(formatProfile))

const fetchProfileFriends = username => fetchProfile(username).then(profile => profile.friends)

const fetchProfileTrips = (username, zipcode, limit) =>
  request(`/trips/v1/${username}`, { limit, zip: zipcode }).then(data => ({
    completed: data.feed_trips,
    trips: data.trips.map(formatTrip)
  }))

export default {
  fetchProfile,
  fetchProfileFriends,
  fetchProfileTrips,
  fetchTopProducers
}
