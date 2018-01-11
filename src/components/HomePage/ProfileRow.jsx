import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import ProfileRankStats from '../ProfileRankStats/ProfileRankStats'
import SmallTripBox from '../SmallTripBox/SmallTripBox'

import './ProfileRow.css'

const ProfileRow = ({ profile, rank }) => (
  <div className="row profile-row">
    <div className="col col-lg-5">
      <ProfileRankStats profile={profile} rank={rank} />
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
  }).isRequired,
  rank: PropTypes.number.isRequired
}

export default observer(ProfileRow)
