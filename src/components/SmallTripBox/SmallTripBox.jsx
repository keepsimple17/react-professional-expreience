import React from 'react'
import PropTypes from 'prop-types'

import './SmallTripBox.css'

const SmallTripBox = ({ trip }) => (
  <div className="small-trip-box embed-responsive-1by1">
    <img className="trip-picture" src={trip.pictureUrl} alt="Trip" />
    <div className="trip-overlay d-flex flex-column justify-content-center">
      <p>
        {`${trip.carbonOutput} lbs`}
      </p>
      <p>
        CO₂/yr
      </p>
    </div>
  </div>
)

SmallTripBox.propTypes = {
  trip: PropTypes.shape({
    carbonOutput: PropTypes.number,
    pictureUrl: PropTypes.string
  }).isRequired
}

export default SmallTripBox
