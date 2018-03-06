/* eslint-disable no-param-reassign */

import { types, flow, getParent } from 'mobx-state-tree'

import api from './api'

export const Trip = types.model('Trip', {
  carbonOutput: types.number,
  destinationName: types.string,
  distance: types.number,
  id: types.identifier(types.string),
  pictureUrl: types.string,
  tripDate: types.number,
  completed: types.boolean,
  errored: types.boolean
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
      })),
    score: types.number
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
    completed: false,
    friends: types.late(() => types.optional(types.array(Profile), [])),
    loading: true
  })
  .actions((self) => {
    const updateFriends = flow(function * updateFriends () {
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

    const shouldSubscribe = store => !store.completed

    const pullFriends = flow(function * pullFriends () {
      self.loading = true

      try {
        yield updateFriends()
      } catch (error) {
        return Promise.reject(error)
      }

      if (!shouldSubscribe(self)) {
        self.loading = false
        return Promise.resolve(self.friends)
      }

      const iterator = api.iterateFriends(getParent(self).username)

      while (true) {
        const { done, value } = iterator.next(self.cancelled)

        // done:true means the previous value was the last one
        if (done) break

        const data = yield value
        if (!data.completed) {
          let friends = [...self.friends]
          // we send friends one by one, by we use array for
          // compatability with final friends
          const newFriend = data.friends[0]
          const index = self.friends.findIndex(f => f.instagramId === newFriend.instagramId)
          if (index === -1) {
            friends.push(newFriend)
          } else {
            friends[index].score = newFriend.score
          }
          friends = friends.sort((a, b) => b.score - a.score).slice(0, 20)
          self.friends = friends.sort((a, b) => {
            if (a.username > b.username) return 1
            if (a.username < b.username) return -1
            return 0
          })
        } else {
          self.friends = data.friends
        }
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
        // If the subscription was cancelled via self.cancel(), gracefully finish the trips iterator
        // and exit the while loop.
        if (self.cancelled) {
          iterator.return()
          break
        }

        // Get next value out of the trips iterator, it is going to be a Promise if done:false,
        // and going to be undefined otherwise.
        const { done, value } = iterator.next(self.cancelled)

        // done:true means the previous value was the last one and current one is undefined.
        if (done) break

        // value is a promise, yield it to mobx-state-tree.
        // Once the Promise resolves, the generator execution is resumend and data is going to hold
        // the value of whatever the Promise resolved.
        const data = yield value

        // The socketio api returns 2 types of data structure depending on the event type:
        // 1) An Array containing all the trips that have been scraped, once scrape is completed.
        // 2) An Object representing a single trip that has been found; scraping is not done yet.
        if (Array.isArray(data)) {
          // Replace whatever the list of trips was with this fresh data from the API.
          self.trips = data
          // Mark the trips store as completed.
          self.completed = true
          // At this point we know stuff is done. But don't break the loop here to let the generator
          // finish gracefully to run its cleanup (close connections and stuff).
        } else {
          // If we got a single trip, add it in the list if is new, or update existing.
          const index = self.trips.findIndex(trip => trip.id === data.id)

          if (index > -1) {
            self.trips[index] = data
          } else {
            self.trips.push(data)
          }
        }
      }

      // The following is excecuted whenever the subscription has finished or has been cancelled.

      // Re-fetch the profile, mainly to get new stats on carbon output.
      getParent(self).refreshProfile()

      // This profile's trips are not loading anymore.
      self.loading = false
      // Reset the cancelled state, no matter if it was cancelled or not.
      self.cancelled = false

      // Handle back the trips collected to the callee.
      return Promise.resolve(self.trips)
    })

    const cancel = () => {
      // Do not cancel if it is not loading.
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
