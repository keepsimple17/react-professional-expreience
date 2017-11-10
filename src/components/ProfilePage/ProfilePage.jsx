import React, { Component } from 'react'
import PropTypes from 'prop-types'

import api from '../../api'
import ProfileCard from '../ProfileCard/ProfileCard'
import SmallTripBox from '../SmallTripBox/SmallTripBox'
import TripCard from '../TripCard/TripCard'

import './ProfilePage.css'

const getColor = (carbon) => {
  // Blue if no carbon output
  if (!carbon) return '#1ba1fb'

  const alpha = Math.min(carbon / 800000, 1)

  return `hsla(0, 64%, 52%, ${alpha})`
}

class ProfilePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      friends: null,
      loading: 0,
      profile: null,
      trips: null
    }
  }

  componentWillMount () {
    this.updateProfileData(this.props.username)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.username !== nextProps.username) {
      this.updateProfileData(nextProps.username)
    }
  }

  decrementLoading (n = 1) {
    this.setState(prevState => ({
      loading: Math.max(prevState.loading - n, 0)
    }))
  }

  incrementLoading (n = 1) {
    this.setState(prevState => ({
      loading: prevState.loading + n
    }))
  }

  updateProfileData (username) {
    this.incrementLoading()

    api
      .fetchProfile(username)
      .then((profile) => {
        this.setState(prevState => ({
          profile
        }))

        return Promise.all([
          api.fetchProfileFriends(username).then((data) => {
            this.setState(prevState => ({
              friends: data
            }))
          }),
          api.fetchProfileTrips(username).then((data) => {
            this.setState(prevState => ({
              trips: data
            }))
          })
        ])
      })
      .then(() => this.decrementLoading())
  }

  render () {
    return (
      <section className="profile-page">
        {!!this.state.loading && (
          <section className="profile-loading-bar">
            <div className="container">
              <div className="row">
                <div className="col">
                  <p>Calculating carbon footprint…</p>
                </div>
              </div>
            </div>
          </section>
        )}
        <section className="profile-overview">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-lg-5">
                {this.state.profile && <ProfileCard profile={this.state.profile} />}
              </div>
              <div className="d-none d-lg-block col-lg-7">
                <ul className="trip-grid">
                  {this.state.trips &&
                    this.state.trips.map(trip => (
                      <li
                        className="trip-item"
                        key={trip.pictureUrl}
                        style={{
                          backgroundColor: getColor(trip.carbonOutput)
                        }}
                      >
                        <SmallTripBox trip={trip} />
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="profile-contents">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-lg-8">
                {this.state.profile && (
                  <h3 className="trips-heading">
                    {this.state.profile.fullName || `@${this.state.profile.username}`}’s travel
                    posts
                  </h3>
                )}
                <div className="row">
                  {this.state.trips &&
                    this.state.trips.map(trip => (
                      <div className="col-12 col-md-6 col-xl-4 trip-col" key={trip.pictureUrl}>
                        <TripCard profile={this.state.profile} trip={trip} />
                      </div>
                    ))}
                </div>
              </div>
              <div className="col-xs-12 col-lg-4 order-lg-first">
                {this.state.profile && (
                  <h3 className="friends-heading">
                    {this.state.profile.fullName || `@${this.state.profile.username}`}’s friends
                  </h3>
                )}
                <ul className="friend-list">
                  {this.state.friends &&
                    this.state.friends.map(profile => (
                      <li className="friend-item" key={profile.username}>
                        <ProfileCard profile={profile} />
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </section>
    )
  }
}

ProfilePage.propTypes = {
  username: PropTypes.string.isRequired
}

export default ProfilePage
