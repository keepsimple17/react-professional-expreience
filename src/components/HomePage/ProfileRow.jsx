import React, { Component } from 'react'
import PropTypes from 'prop-types'

import api from '../../api'
import ProfileCard from '../ProfileCard/ProfileCard'
import SmallTripBox from '../SmallTripBox/SmallTripBox'

class ProfileRow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      trips: null
    }
  }

  async componentWillMount () {
    const trips = await api.fetchProfileTrips(
      this.props.profile.username,
      this.props.profile.zipcode
    )

    this.setState(() => ({
      trips: trips || []
    }))
  }

  render () {
    return (
      <div className="row producer-row">
        <div className="col col-lg-5">
          <ProfileCard profile={this.props.profile} />
        </div>
        <div className="d-none d-lg-block col-lg-7">
          <ul className="trip-list">
            {this.state.trips &&
              this.state.trips.slice(0, 5).map(trip => (
                <li className="trip-item" key={trip.pictureUrl}>
                  <SmallTripBox trip={trip} />
                </li>
              ))}
          </ul>
        </div>
      </div>
    )
  }
}

ProfileRow.propTypes = {
  profile: PropTypes.shape({
    username: PropTypes.string,
    zipcode: PropTypes.string
  }).isRequired
}

export default ProfileRow
