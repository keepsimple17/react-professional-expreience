import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'

import FriendsList from './FriendsList'
import pipe from '../../util/pipe'
import PrivateProfile from './PrivateProfile'
import ProfileCard from '../ProfileCard/ProfileCard'
import TripCardList from './TripCardList'
import TripGrid from './TripGrid'

import './ProfilePage.css'

const getName = profile => profile.fullName || `@${profile.username}`

class ProfilePage extends Component {
  constructor (...args) {
    super(...args)

    this.state = {
      error: null
    }
  }

  componentWillMount () {
    this.updateProfileData(this.props.username)
    window.scrollTo(0, 0)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.username !== nextProps.username) {
      if (this.state.profile) this.state.profile.cancel()

      this.updateProfileData(nextProps.username)

      window.scrollTo(0, 0)
    }
  }

  componentWillUnmount () {
    if (this.state.profile) this.state.profile.cancel()
  }

  updateProfileData (username) {
    return this.props.store
      .fetchProfile(username)
      .then((profile) => {
        if (!profile.private && profile.friends.loading) profile.friends.pullFriends()

        profile.trips.pullTrips(100)

        this.setState(() => ({
          profile: this.props.store.profiles.get(username)
        }))
      })
      .catch((error) => {
        this.setState(() => ({ error }))
      })
  }

  render () {
    if (this.state.profile && this.state.profile.private) {
      return <PrivateProfile profile={this.state.profile} />
    }

    return (
      <section className="profile-page">
        {this.state.error && (
          <section className="profile-message-bar -error">
            <div className="container">
              <div className="row">
                <div className="col">
                  <p className="message-bar-content text-center">
                    {this.state.error.message}
                    {` – `}
                    <button
                      className="btn-link"
                      onClick={e => window.location.reload()}
                      type="button"
                    >
                      try again
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
        {this.state.profile &&
          this.state.profile.loading && (
            <section className="profile-message-bar -info">
              <div className="container">
                <div className="row">
                  <div className="col">
                    <p className="message-bar-content text-center">Calculating carbon footprint…</p>
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
                {this.state.profile && <TripGrid profile={this.state.profile} />}
              </div>
            </div>
          </div>
        </section>

        {this.state.profile && (
          <section className="download-app-bar">
            <div className="container">
              <div className="row">
                <div
                  className="col-12 col-md-auto text-center text-md-left d-flex align-items-center"
                >
                  <p className="download-app-message">
                    {`Are you ${getName(this.state.profile)}? Claim this account to go carbon neutral.`}
                  </p>
                </div>
                <div className="col-12 col-md text-center text-md-right">
                  <p>
                    <Link className="download-app-link" to="/download">
                      Download the app
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="profile-contents">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-lg-8">
                <div className="row align-items-center">
                  <div className="col">
                    {this.state.profile && (
                      <h3 className="trips-heading">
                        {getName(this.state.profile)}’s travel posts
                      </h3>
                    )}
                  </div>
                </div>
                {this.state.profile &&
                  this.state.profile.trips.trips && <TripCardList profile={this.state.profile} />}
              </div>
              <div className="col-xs-12 col-lg-4 order-lg-first">
                {this.state.profile && (
                  <h3 className="friends-heading">{getName(this.state.profile)}’s friends</h3>
                )}
                {this.state.profile && <FriendsList friends={this.state.profile.friends} />}
              </div>
            </div>
          </div>
        </section>
      </section>
    )
  }
}

ProfilePage.propTypes = {
  store: PropTypes.shape({
    fetchProfile: PropTypes.func,
    profiles: PropTypes.shape({
      get: PropTypes.func
    })
  }).isRequired,
  username: PropTypes.string.isRequired
}

export default pipe([observer, inject('store')])(ProfilePage)
