import React from 'react'
import PropTypes from 'prop-types'

import ProfileCard from '../ProfileCard/ProfileCard'
import SmallTripBox from '../SmallTripBox/SmallTripBox'

const ProfileRow = ({ data }) => (
  <div className="row producer-row">
    <div className="col col-lg-5">
      <ProfileCard profile={data.profile} />
    </div>
    <div className="d-none d-lg-block col-lg-7">
      <ul className="trip-list">
        {data.trips &&
          data.trips.slice(0, 5).map(trip => (
            <li className="trip-item" key={trip.pictureUrl}>
              <SmallTripBox trip={trip} />
            </li>
          ))}
      </ul>
    </div>
  </div>
)

ProfileRow.propTypes = {
  data: PropTypes.shape({
    profile: PropTypes.shape({
      username: PropTypes.string
    }),
    zipcode: PropTypes.string
  }).isRequired
}

export default ProfileRow
