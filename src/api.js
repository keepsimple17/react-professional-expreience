/* global fetch */

import io from 'socket.io-client'

import defer from './util/defer'
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
    completed: false
  },
  username: profile.instagram_username
})

const fetchProfile = username =>
  request(`/users/v1/ig/${username}`).then(pipe([normalizeProfile, formatProfile]))

const fetchTopProducers = () =>
  request('/feeds/v1/top-offenders').then(data => data.entities.map(formatProfile))

const fetchProfileFriends = username => fetchProfile(username).then(profile => profile.friends)

const fetchProfileTrips = (username, limit) =>
  request(`/trips/v1/${username}`, {
    limit,
    // TODO: This is required for the API to not break. Remove when API is ready.
    zip: 10001
  }).then(data => ({
    completed: data.feed_trips,
    trips: data.trips.map(formatTrip)
  }))

const iterateTrips = function * iterateTrips (username) {
  const socket = io(REACT_APP_API_URI, { query: { user: username } })

  let cancelled
  let done
  let nextValue = defer()

  // new trip was found.
  socket.on('completed_posts', (data) => {
    nextValue.resolve(formatTrip(data))
    nextValue = defer()
  })

  // Profile has been scraped completely and all found trips are provided here.
  socket.on('completed_trips', (data) => {
    nextValue.resolve(data.map(formatTrip))
    done = true
  })

  // Things went wrong, close.
  socket.on('error', (error) => {
    nextValue.reject(error)
    done = true
  })

  while (true) {
    if (done || cancelled) {
      socket.close()
      return nextValue
    }

    cancelled = yield nextValue
  }
}

export default {
  fetchProfile,
  fetchProfileFriends,
  fetchProfileTrips,
  fetchTopProducers,
  iterateTrips
}
