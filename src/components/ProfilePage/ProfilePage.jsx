import React, { Component } from 'react'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import api from '../../api'
import ProfileCard from '../ProfileCard/ProfileCard'
import SingleInputForm from '../SingleInputForm/SingleInputForm'
import SmallTripBox from '../SmallTripBox/SmallTripBox'
import TripCard from '../TripCard/TripCard'

import './ProfilePage.css'

const getColor = (carbon) => {
  // Blue if no carbon output
  if (!carbon) return '#1ba1fb'

  const alpha = Math.min(carbon / 800000, 1)

  return `hsla(0, 64%, 52%, ${alpha})`
}

const getName = profile => profile.fullName || `@${profile.username}`

class ProfilePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      friends: null,
      isZipcodeModalOpen: false,
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

  openZipcodeModal (event) {
    if (event) event.preventDefault()

    this.setState(() => ({
      isZipcodeModalOpen: true
    }))
  }

  closeZipcodeModal (event) {
    if (event) event.preventDefault()

    this.setState(() => ({
      isZipcodeModalOpen: false
    }))
  }

  submitZipcode (zipcode) {
    this.closeZipcodeModal()

    this.updateTripsData(this.state.profile.username, zipcode)
  }

  updateProfileData (username) {
    this.incrementLoading()

    api.fetchProfile(username).then((profile) => {
      this.setState(() => ({
        profile
      }))

      this.updateFriendsData(username)

      if (profile.zipcode) {
        this.updateTripsData(username, profile.zipcode)
      } else {
        this.openZipcodeModal()
      }

      this.decrementLoading()
    })
  }

  updateTripsData (username, zipcode) {
    this.incrementLoading()

    return api.fetchProfileTrips(username, zipcode).then((data) => {
      this.setState(() => ({
        trips: data
      }))

      this.decrementLoading()
    })
  }

  updateFriendsData (username) {
    this.incrementLoading()

    return api.fetchProfileFriends(username).then((data) => {
      this.setState(() => ({
        friends: data
      }))

      this.decrementLoading()
    })
  }

  render () {
    return (
      <section className="profile-page">
        <Modal
          className="regular-modal-content"
          contentLabel="Modal"
          isOpen={this.state.isZipcodeModalOpen}
          onRequestClose={() => {}}
          overlayClassName="regular-modal-overlay"
        >
          <section className="modal-header">
            <h3 className="modal-title">What’s John’s zip code?</h3>
          </section>
          <section className="modal-body">
            <div className="row">
              <div className="col">
                <p className="modal-lead-message">
                  In order to calculate John’s carbon footprint, we need his ZIP code
                </p>
                <SingleInputForm
                  pattern="[0-9]{5}"
                  required
                  autoFocus
                  buttonText="Calculate"
                  placeholder="5 digits ZIP Code"
                  onSubmit={(event, zipcode) => this.submitZipcode(zipcode)}
                />
              </div>
            </div>
          </section>
        </Modal>
        {!!this.state.loading && (
          <section className="profile-loading-bar">
            <div className="container">
              <div className="row">
                <div className="col">
                  <p className="loading-message text-center">Calculating carbon footprint…</p>
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
                {this.state.profile && (
                  <h3 className="trips-heading">{getName(this.state.profile)}’s travel posts</h3>
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
                  <h3 className="friends-heading">{getName(this.state.profile)}’s friends</h3>
                )}
                <ul className="friend-list">
                  {this.state.friends &&
                    this.state.friends.map((profile, i) => (
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
