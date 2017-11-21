import React from 'react'
import PropTypes from 'prop-types'

import getName from '../../util/getName'

import './PrivateProfile.css'

const TripGrid = ({ profile }) => (
  <div className="private-profile">
    <div className="private-profile-hero">
      <div className="container">
        <div className="row">
          <div className="col">
            <p>
              {getName(profile)} has a private Instagram account
            </p>
            <p>
              Is this you?
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

TripGrid.propTypes = {
  profile: PropTypes.shape({
    username: PropTypes.string
  }).isRequired
}

export default TripGrid
