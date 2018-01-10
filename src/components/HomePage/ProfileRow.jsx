import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import ProfileCard from '../ProfileCard/ProfileCard'
import SmallTripBox from '../SmallTripBox/SmallTripBox'

import './ProfileRow.css'

const ProfileRow = ({ profile }) => (
  <div className="row profile-row">
    <div className="col col-lg-5">
      <ProfileCard profile={profile} />
    </div>
    <div className="d-none d-lg-block col-lg-7">
      <ul className="trip-list">
        {profile.trips.trips &&
          profile.trips.trips.map(trip => (
            <li className="trip-item" key={trip.pictureUrl}>
              <SmallTripBox trip={trip} />
            </li>
          ))}
      </ul>
    </div>
  </div>
)

ProfileRow.propTypes = {
  profile: PropTypes.shape({
    username: PropTypes.string
  }).isRequired
}

export default observer(ProfileRow)
