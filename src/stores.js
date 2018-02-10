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

export const Profile = types
  .model('Profile', {
    carbonOutput: types.number,
    friends: types.late(() =>
      types.optional(FriendsStore, {
        friends: []
      })),
    fullName: types.maybe(types.string),
    instagramId: types.string,
    private: types.boolean,
    profilePictureUrl: types.string,
    scraped: types.boolean,
    username: types.identifier(types.string),
    trips: types.late(() =>
      types.optional(TripsStore, {
        trips: []
      }))
  })
  .actions((self) => {
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
      refreshProfile
    }
  })
  .views(self => ({
    get loading () {
      return self.friends.loading || self.trips.loading
    },
    get completed () {
      return self.friends.completed && self.trips.completed
    }
  }))

export const FriendsStore = types
  .model('FriendsStore', {
    attempts: 0,
    completed: false,
    friends: types.late(() => types.optional(types.array(Profile), [])),
    lastCount: 0,
    loading: true
  })
  .actions((self) => {
    const updateFriends = flow(function * updateFriends () {
      self.attempts += 1
      self.lastCount = self.friends.length

      try {
        const { username } = getParent(self)

        const data = yield api.fetchProfileFriends(username)

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
          if (shouldRetry(self)) yield wait(500)
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

export const TripsStore = types
  .model('TripsStore', {
    cancelled: false,
    completed: false,
    loading: true,
    trips: types.optional(types.array(Trip), [])
  })
  .actions((self) => {
    const updateTrips = flow(function * updateTrips (limit) {
      try {
        const { username } = getParent(self)

        const data = yield api.fetchProfileTrips(username, limit)

        self.trips = data.trips
        self.completed = data.completed

        return Promise.resolve(self.trips)
      } catch (error) {
        return Promise.reject(error)
      }
    })

    const shouldSubscribe = (store, limit) =>
      !store.completed && store.trips.length < (limit || Infinity)

    const pullTrips = flow(function * pullTrips (limit) {
      self.loading = true

      try {
        yield updateTrips(limit)
      } catch (error) {
        return Promise.reject(error)
      }

      if (!shouldSubscribe(self, limit)) {
        self.loading = false
        return Promise.resolve(self.trips)
      }

      const iterator = api.iterateTrips(getParent(self).username)

      while (true) {
        const { done, value } = iterator.next(self.cancelled)

        if (done || !value) break

        const data = yield value

        if (Array.isArray(data)) {
          self.trips = data
          self.completed = true
        } else {
          self.trips.push(data)
        }
      }

      getParent(self).refreshProfile()

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

export const AppStore = types
  .model('AppStore', {
    profiles: types.optional(types.map(Profile), {}),
    topProducers: types.optional(types.array(types.reference(Profile)), [])
  })
  .actions((self) => {
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
