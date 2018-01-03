/* eslint-disable no-param-reassign */

import { types, flow, getParent } from 'mobx-state-tree'

import api from './api'
import wait from './util/wait'

export const Trip = types.model('Trip', {
  carbonOutput: types.number,
  destinationName: types.string,
  distance: types.number,
  id: types.identifier(types.string),
  pictureUrl: types.string,
  tripDate: types.number
})

export const Profile = types.model('Profile', {
  carbonOutput: types.number,
  friends: types.late(() => types.optional(FriendsStore, {
    friends: []
  })),
  fullName: types.maybe(types.string),
  instagramId: types.string,
  private: types.boolean,
  profilePictureUrl: types.string,
  scraped: types.boolean,
  username: types.identifier(types.string),
  trips: types.late(() => types.optional(TripsStore, {
    trips: []
  })),
  zipcode: types.maybe(types.string, null)
}).actions((self) => {
  const updateZipcode = (zipcode) => {
    self.zipcode = zipcode
    if (!self.private) self.trips.pullTrips()
  }

  const refreshProfile = flow(function * refreshProfile () {
    try {
      const { carbonOutput } = yield api.fetchProfile(self.username)

      Object.assign(self, { carbonOutput })

      return Promise.resolve(self)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  const cancel = () => {
    self.friends.cancel()
    self.trips.cancel()
  }

  return {
    cancel,
    refreshProfile,
    updateZipcode
  }
}).views(self => ({
  get loading () {
    return self.friends.loading || self.trips.loading
  },
  get completed () {
    return self.friends.completed && self.trips.completed
  }
}))

export const FriendsStore = types.model('FriendsStore', {
  attempts: 0,
  completed: false,
  friends: types.late(() => types.optional(types.array(Profile), [])),
  lastCount: 0,
  loading: true
}).actions((self) => {
  const updateFriends = flow(function * updateFriends () {
    self.attempts += 1
    self.lastCount = self.friends.length

    try {
      const { username, zipcode } = getParent(self)

      const data = yield api.fetchProfileFriends(username, zipcode)

      self.friends = data.friends
      self.completed = data.completed

      return Promise.resolve(self.friends)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  const shouldRetry = store => !store.completed && !store.cancelled

  const pullFriends = flow(function * pullFriends () {
    self.loading = true

    try {
      while (shouldRetry(self)) {
        yield updateFriends()
        if (shouldRetry(self)) yield wait(3000)
      }
      if (self.attempts > 1) getParent(self).refreshProfile()
    } catch (error) {
      return Promise.reject(error)
    }

    self.loading = false
    self.cancelled = false

    return Promise.resolve(self.friends)
  })

  const cancel = () => {
    if (self.loading && !self.cancelled) {
      self.cancelled = true
    }
  }

  return {
    cancel,
    pullFriends,
    updateFriends
  }
})

export const TripsStore = types.model('TripsStore', {
  attempts: 0,
  cancelled: false,
  completed: false,
  lastCount: 0,
  loading: true,
  trips: types.optional(types.array(Trip), [])
}).actions((self) => {
  const updateTrips = flow(function * updateTrips (limit) {
    self.attempts += 1
    self.lastCount = self.trips.length

    try {
      const { username, zipcode } = getParent(self)

      const data = yield api.fetchProfileTrips(username, zipcode, limit)

      self.trips = data.trips
      self.completed = data.completed

      return Promise.resolve(self.trips)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  const shouldRetry = (store, limit) =>
    !store.completed && !store.cancelled && store.trips.length < (limit || Infinity)

  const pullTrips = flow(function * pullTrips (limit) {
    self.loading = true

    try {
      while (shouldRetry(self, limit)) {
        yield updateTrips(limit)
        if (shouldRetry(self, limit)) yield wait(3000)
      }
      if (self.attempts > 1) getParent(self).refreshProfile()
    } catch (error) {
      return Promise.reject(error)
    }

    self.loading = false
    self.cancelled = false

    return Promise.resolve(self.trips)
  })

  const cancel = () => {
    if (self.loading && !self.cancelled) {
      self.cancelled = true
    }
  }

  return {
    cancel,
    pullTrips,
    updateTrips
  }
})

export const AppStore = types.model('AppStore', {
  profiles: types.optional(types.map(Profile), {}),
  topProducers: types.optional(types.array(types.reference(Profile)), [])
}).actions((self) => {
  const fetchProfile = flow(function * fetchProfile (username) {
    const cached = self.profiles.get(username)

    if (cached) return Promise.resolve(cached)

    try {
      const data = yield api.fetchProfile(username)

      self.profiles.put(data)

      return Promise.resolve(self.profiles.get(username))
    } catch (error) {
      return Promise.reject(error)
    }
  })

  const fetchTopProducers = flow(function * fetchTopProducers () {
    if (self.topProducers.length) return Promise.resolve(self.topProducers)

    try {
      const profiles = yield api.fetchTopProducers()

      profiles.forEach((profile) => {
        self.profiles.put(profile)
        self.topProducers.push(profile.username)
      })

      return Promise.resolve(self.topProducers)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  return {
    fetchProfile,
    fetchTopProducers
  }
})
