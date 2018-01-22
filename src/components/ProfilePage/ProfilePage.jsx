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
      if (this.profile) this.profile.cancel()

      this.updateProfileData(nextProps.username)

      window.scrollTo(0, 0)
    }
  }

  componentWillUnmount () {
    if (this.profile) this.profile.cancel()
  }

  get profile () {
    return this.props.store.profiles.get(this.props.username)
  }

  updateProfileData (username) {
    return this.props.store
      .fetchProfile(username)
      .then((profile) => {
        if (!profile.private && profile.friends.loading) this.profile.friends.pullFriends()

        this.profile.trips.pullTrips(100)
      })
      .catch((error) => {
        this.setState(() => ({ error }))
      })
  }

  render () {
    if (this.profile && this.profile.private) {
      return <PrivateProfile profile={this.profile} />
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
        {this.profile &&
          this.profile.loading && (
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
                {this.profile && <ProfileCard profile={this.profile} />}
              </div>
              <div className="d-none d-lg-block col-lg-7">
                {this.profile && <TripGrid profile={this.profile} />}
              </div>
            </div>
          </div>
        </section>

        {this.profile && (
          <section className="download-app-bar">
            <div className="container">
              <div className="row">
                <div
                  className="col-12 col-md-auto text-center text-md-left d-flex align-items-center"
                >
                  <p className="download-app-message">
                    {`Are you ${getName(this.profile)}? Claim this account to go carbon neutral.`}
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
                    {this.profile && (
                      <h3 className="trips-heading">{getName(this.profile)}’s travel posts</h3>
                    )}
                  </div>
                </div>
                {this.profile &&
                  this.profile.trips.trips && <TripCardList profile={this.profile} />}
              </div>
              <div className="col-xs-12 col-lg-4 order-lg-first">
                {this.profile && (
                  <h3 className="friends-heading">{getName(this.profile)}’s friends</h3>
                )}
                {this.profile && <FriendsList friends={this.profile.friends} />}
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
