import React, { Component } from 'react'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import { withLastLocation } from 'react-router-last-location'

import api from '../../api'
import FriendsDataWrapper from '../FriendsDataWrapper/FriendsDataWrapper'
import FriendsList from './FriendsList'
import PrivateProfile from './PrivateProfile'
import ProfileCard from '../ProfileCard/ProfileCard'
import SingleInputForm from '../SingleInputForm/SingleInputForm'
import TripCardList from './TripCardList'
import TripGrid from './TripGrid'
import TripsDataWrapper from '../TripsDataWrapper/TripsDataWrapper'

import './ProfilePage.css'

const getName = profile => profile.fullName || `@${profile.username}`

class ProfilePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isZipcodeModalOpen: false,
      loading: 0,
      profile: null,
      zipcode: null
    }
  }

  componentWillMount () {
    this.updateProfileData(this.props.username)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.username !== nextProps.username) {
      this.setState(() => ({
        friends: null,
        isZipcodeModalOpen: false,
        profile: null,
        zipcode: null
      }))
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

    if (!this.state.zipcode) {
      return this.props.lastLocation ? this.props.history.goBack() : this.props.history.push('/')
    }

    return this.setState(() => ({
      isZipcodeModalOpen: false
    }))
  }

  submitZipcode (zipcode) {
    this.closeZipcodeModal()
    this.setState(() => ({ zipcode }))
  }

  updateProfileData (username) {
    this.incrementLoading()

    api
      .fetchProfile(username)
      .then((profile) => {
        this.setState(() => ({ profile }))

        if (profile.zipcode) {
          this.setState(() => ({ zipcode: profile.zipcode }))
        } else {
          this.openZipcodeModal()
        }

        this.decrementLoading()
      })
      .catch((error) => {
        this.setState(() => ({ error }))
        this.decrementLoading()
      })
  }

  render () {
    if (this.state.profile && this.state.profile.private) {
      return <PrivateProfile profile={this.state.profile} />
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
          {this.state.profile && (
            <section className="modal-header">
              <h3 className="modal-title">What’s {getName(this.state.profile)}’s zip code?</h3>
            </section>
          )}
          {this.state.profile && (
            <section className="modal-body">
              <div className="row">
                <div className="col">
                  <p className="modal-lead-message">
                    In order to calculate {getName(this.state.profile)}’s carbon footprint, we need
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
        {(!!this.state.loading || this.state.isZipcodeModalOpen) && (
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
                {this.state.profile &&
                  this.state.zipcode && (
                    <TripsDataWrapper
                      component={TripGrid}
                      profile={this.state.profile}
                      zipcode={this.state.zipcode}
                    />
                  )}
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
                  <div className="col">
                    {this.state.zipcode && (
                      <p className="zipcode-details">
                        Trips based on zip code: {this.state.zipcode}.{' '}
                        <button
                          type="button"
                          className="btn-link"
                          onClick={e => this.openZipcodeModal(e)}
                        >
                          Click here to change
                        </button>
                      </p>
                    )}
                  </div>
                </div>
                {this.state.profile &&
                  this.state.zipcode && (
                    <TripsDataWrapper
                      component={TripCardList}
                      profile={this.state.profile}
                      zipcode={this.state.zipcode}
                    />
                  )}
              </div>
              <div className="col-xs-12 col-lg-4 order-lg-first">
                {this.state.profile && (
                  <h3 className="friends-heading">{getName(this.state.profile)}’s friends</h3>
                )}
                {this.state.profile && (
                  <FriendsDataWrapper component={FriendsList} profile={this.state.profile} />
                )}
              </div>
            </div>
          </div>
        </section>
      </section>
    )
  }
}

ProfilePage.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func,
    location: PropTypes.shape({}),
    push: PropTypes.func
  }).isRequired,
  lastLocation: PropTypes.shape({}).isRequired,
  username: PropTypes.string.isRequired
}

export default withLastLocation(withRouter(ProfilePage))
