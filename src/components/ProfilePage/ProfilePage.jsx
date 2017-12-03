import React, { Component } from 'react'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Link, withRouter } from 'react-router-dom'
import { withLastLocation } from 'react-router-last-location'

import FriendsList from './FriendsList'
import pipe from '../../util/pipe'
import PrivateProfile from './PrivateProfile'
import ProfileCard from '../ProfileCard/ProfileCard'
import SingleInputForm from '../SingleInputForm/SingleInputForm'
import TripCardList from './TripCardList'
import TripGrid from './TripGrid'

import './ProfilePage.css'

const getName = profile => profile.fullName || `@${profile.username}`

class ProfilePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isZipcodeModalOpen: false
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

  get profile () {
    return this.props.store.profiles.get(this.props.username)
  }

  openZipcodeModal (event) {
    if (event) event.preventDefault()

    this.setState(() => ({
      isZipcodeModalOpen: true
    }))
  }

  closeZipcodeModal (event) {
    if (event) event.preventDefault()

    if (!this.profile.zipcode) {
      return this.props.lastLocation ? this.props.history.goBack() : this.props.history.push('/')
    }

    return this.setState(() => ({
      isZipcodeModalOpen: false
    }))
  }

  submitZipcode (zipcode) {
    this.profile.updateZipcode(zipcode)
    this.closeZipcodeModal()
  }

  updateProfileData (username) {
    return this.props.store
      .fetchProfile(username)
      .then((profile) => {
        if (profile.friends.loading) this.profile.friends.pullFriends()

        if (profile.zipcode) {
          this.profile.updateZipcode(profile.zipcode)
        } else {
          this.openZipcodeModal()
        }
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
        <Modal
          className="regular-modal-content"
          contentLabel="Modal"
          isOpen={this.state.isZipcodeModalOpen}
          onRequestClose={() => this.closeZipcodeModal()}
          overlayClassName="regular-modal-overlay"
        >
          {this.profile && (
            <section className="modal-header">
              <h3 className="modal-title">What’s {getName(this.profile)}’s zip code?</h3>
            </section>
          )}
          {this.profile && (
            <section className="modal-body">
              <div className="row">
                <div className="col">
                  <p className="modal-lead-message">
                    In order to calculate {getName(this.profile)}’s carbon footprint, we need
                    his ZIP code
                  </p>
                  <SingleInputForm
                    autoFocus
                    buttonText="Calculate"
                    maxLength="5"
                    minLength="5"
                    onSubmit={(event, zipcode) => this.submitZipcode(zipcode)}
                    pattern="[0-9]{5}"
                    placeholder="5 digits ZIP Code"
                    required
                  />
                </div>
              </div>
            </section>
          )}
        </Modal>
        {!!this.state.error && (
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
        {this.profile && this.profile.loading && (
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
                {this.profile && this.profile.zipcode && (
                  <TripGrid profile={this.profile} />
                )}
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
                      <h3 className="trips-heading">
                        {getName(this.profile)}’s travel posts
                      </h3>
                    )}
                  </div>
                  <div className="col">
                    {this.profile && this.profile.zipcode && !this.profile.trips.completed && (
                      <p className="zipcode-details">
                        Trips based on zip code: {this.profile.zipcode}.{' '}
                        <button
                          type="button"
                          className="btn-link -blue"
                          onClick={e => this.openZipcodeModal(e)}
                        >
                          Click here to change
                        </button>
                      </p>
                    )}
                  </div>
                </div>
                {this.profile && this.profile.zipcode && (
                  <TripCardList profile={this.profile} />
                )}
              </div>
              <div className="col-xs-12 col-lg-4 order-lg-first">
                {this.profile && (
                  <h3 className="friends-heading">{getName(this.profile)}’s friends</h3>
                )}
                {this.profile && (
                  <FriendsList friends={this.profile.friends} />
                )}
              </div>
            </div>
          </div>
        </section>
      </section>
    )
  }
}

ProfilePage.defaultProps = {
  lastLocation: null
}

ProfilePage.propTypes = {
  store: PropTypes.shape({
    fetchProfile: PropTypes.func,
    profiles: PropTypes.shape({
      get: PropTypes.func
    })
  }).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func,
    location: PropTypes.shape({}),
    push: PropTypes.func
  }).isRequired,
  lastLocation: PropTypes.shape({}),
  username: PropTypes.string.isRequired
}

export default pipe([
  observer,
  inject('store'),
  withRouter,
  withLastLocation
])(ProfilePage)
