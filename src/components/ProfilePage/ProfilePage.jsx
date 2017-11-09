import React, { Component } from 'react'
import PropTypes from 'prop-types'

import api from '../../api'
import ProfileCard from '../ProfileCard/ProfileCard'
import SmallTripBox from '../SmallTripBox/SmallTripBox'
import TripCard from '../TripCard/TripCard'

import './ProfilePage.css'

class ProfilePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      friends: null,
      profile: null
    }
  }

  async componentWillMount () {
    const profile = await api.fetchProfile(this.props.username)
    const friends = await api.fetchProfileFriends(this.props.username)

    this.setState(() => ({
      friends,
      profile
    }))
  }

  render () {
    return (
      <section className="profile-page">
        <section className="profile-overview">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-lg-5">
                {this.state.profile && (
                  <ProfileCard profile={this.state.profile} />
                )}
              </div>
              <div className="d-none d-lg-block col-lg-7">
                <ul className="trip-grid">
                  {this.state.profile && this.state.profile.trips.map(trip => (
                    <li className="trip-item" key={trip.pictureUrl}>
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
                    {this.state.profile.fullName || `@${this.state.profile.username}`}’s travel posts
                  </h3>
                )}
                <div className="row">
                  {this.state.profile && this.state.profile.trips.map(trip => (
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
                  {this.state.friends && this.state.friends.map(profile => (
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
